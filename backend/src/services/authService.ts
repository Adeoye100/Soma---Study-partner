/**
 * AuthService — deep module for all Authentication operations.
 *
 * Architectural Seam:
 *  - Defines an AuthAdapter port: allows multiple adapters (Supabase in production,
 *    DevInMemoryAuthAdapter for offline development and testing).
 *  - Robust error classification: separates downstream network/DNS outages
 *    (ExternalServiceError -> HTTP 503) from invalid credentials (AuthenticationError -> HTTP 401).
 *  - Dev resilience: when in development mode (pnpm dev) and the downstream Supabase host
 *    cannot be reached (ENOTFOUND / offline), automatically falls back to DevInMemoryAuthAdapter
 *    with an informative warning so developers are never blocked.
 *  - Single token-verification path: verifyToken() works across all adapters.
 *
 * Factory:
 *  - createAuthService(adapterOrClient) — inject any AuthAdapter or SupabaseClient
 *  - authService                       — canonical singleton wired from config
 */
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { AuthenticationError, ExternalServiceError } from '@/shared/errors';
import { logger } from '@/shared/utils/logger';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends AuthCredentials {
  username: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username?: string;
    full_name?: string;
    gender?: string;
    role?: string;
  };
  session: AuthSession | null;
}

export interface VerifiedUser {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  gender?: string;
  role: string;
}

// ── AuthAdapter Port ───────────────────────────────────────────────────────────

export interface AuthAdapter {
  signIn(email: string, password: string): Promise<AuthResponse>;
  signUp(credentials: SignupCredentials): Promise<AuthResponse>;
  getUser(token: string): Promise<VerifiedUser>;
  refreshSession(refreshToken: string): Promise<{ access_token: string; expires_at: number }>;
  signOut(): Promise<void>;
  resetPassword(email: string, redirectTo?: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
}

// ── Supabase Adapter (Production) ─────────────────────────────────────────────

export class SupabaseAuthAdapter implements AuthAdapter {
  constructor(private readonly supabase: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      throw this.classifyError(error);
    }

    if (!data.user || !data.session) {
      throw new AuthenticationError('Invalid login response from authentication service');
    }

    const profile = await this.getUserProfile(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        username: profile?.username,
        full_name: profile?.full_name,
        gender: profile?.gender,
        role: profile?.role ?? 'student',
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token!,
        expires_at: data.session.expires_at!,
        token_type: data.session.token_type,
      },
    };
  }

  async signUp(credentials: SignupCredentials): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email.toLowerCase().trim(),
      password: credentials.password,
      options: {
        emailRedirectTo: `${config.corsOrigins[0]}/auth/callback`,
        data: {
          full_name: credentials.fullName.trim(),
          username: credentials.username.trim().toLowerCase().replace(/\s+/g, '_'),
          gender: credentials.gender,
        },
      },
    });

    if (error) {
      throw this.classifyError(error);
    }

    if (data.user && !data.session) {
      return { user: { id: data.user.id, email: data.user.email! }, session: null };
    }

    if (!data.user || !data.session) {
      throw new AuthenticationError('Invalid signup response from authentication service');
    }

    const profile = await this.getUserProfile(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        username: profile?.username,
        full_name: profile?.full_name,
        gender: profile?.gender,
        role: profile?.role ?? 'student',
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token!,
        expires_at: data.session.expires_at!,
        token_type: data.session.token_type,
      },
    };
  }

  async getUser(token: string): Promise<VerifiedUser> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      if (error && this.isNetworkError(error)) {
        throw this.classifyError(error);
      }
      throw new AuthenticationError('Invalid or expired token');
    }

    const profile = await this.getUserProfile(user.id);

    return {
      id: user.id,
      email: user.email!,
      username: profile?.username,
      full_name: profile?.full_name,
      gender: profile?.gender,
      role: profile?.role ?? 'student',
    };
  }

  async refreshSession(
    refreshToken: string
  ): Promise<{ access_token: string; expires_at: number }> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw this.classifyError(error ?? new Error('Invalid refresh response'));
    }

    return {
      access_token: data.session.access_token,
      expires_at: data.session.expires_at!,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw this.classifyError(error);
  }

  async resetPassword(email: string, redirectTo?: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo ?? `${config.host}/reset-password`,
    });
    if (error) throw this.classifyError(error);
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({ password });
    if (error) throw this.classifyError(error);
  }

  private async getUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id, email, username, full_name, gender, avatar_url, role')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // no row found
        if (error.code === 'PGRST205') {
          logger.warn(
            "Table 'public.users' does not exist. Run migration 001_create_public_users.sql",
            { userId }
          );
          return null;
        }
        logger.error('Error fetching user profile', { userId, error: error.message });
        return null;
      }

      return data;
    } catch (err) {
      logger.error('Unexpected error fetching user profile', { userId, err });
      return null;
    }
  }

  public isNetworkError(error: any): boolean {
    const msg = error?.message ?? String(error);
    const code = error?.code || error?.cause?.code;
    return (
      error?.name === 'AuthRetryableFetchError' ||
      msg.includes('fetch failed') ||
      msg.includes('ENOTFOUND') ||
      msg.includes('ECONNREFUSED') ||
      msg.includes('ETIMEDOUT') ||
      code === 'ENOTFOUND' ||
      code === 'ECONNREFUSED' ||
      error?.status === 0
    );
  }

  public classifyError(error: any): Error {
    if (this.isNetworkError(error)) {
      const msg = error?.message ?? String(error);
      return new ExternalServiceError(
        'Supabase Auth',
        `Identity provider unreachable (${msg}). Downstream server is offline or DNS lookup failed.`,
        { originalError: error }
      );
    }

    const msg: string = error?.message ?? String(error);
    const map: Array<[string, string]> = [
      ['Invalid login credentials',   'Invalid email or password'],
      ['Email not confirmed',         'Please check your email and click the confirmation link'],
      ['User already registered',     'This email is already in use'],
      ['Password should be at least', 'Password must be at least 8 characters long'],
      ['Invalid email',               'Please enter a valid email address'],
      ['rate limit',                  'Too many requests. Please wait a moment and try again'],
    ];
    const match = map.find(([pattern]) => msg.includes(pattern));
    return new AuthenticationError(match ? match[1] : msg, { details: error });
  }
}

// ── Dev InMemory Adapter (Offline / Local Dev / Test) ──────────────────────────

export class DevInMemoryAuthAdapter implements AuthAdapter {
  private users = new Map<string, {
    id: string;
    email: string;
    password: string;
    username: string;
    fullName: string;
    gender: string;
    role: string;
    createdAt: string;
  }>();

  private signingSecret: string;

  constructor(secret = 'soma-dev-secret-key-do-not-use-in-prod') {
    this.signingSecret = config.jwtSecret || secret;

    // Seed default developer account
    const devId = '00000000-0000-4000-a000-000000000001';
    this.users.set('dev@soma.internal', {
      id: devId,
      email: 'dev@soma.internal',
      password: 'password123',
      username: 'dev_user',
      fullName: 'Soma Developer',
      gender: 'other',
      role: 'student',
      createdAt: new Date().toISOString(),
    });
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const normalized = email.toLowerCase().trim();
    let user = this.users.get(normalized);

    // In local development, auto-provision user on first attempt if password is valid
    if (!user) {
      if (password.length < 8) {
        throw new AuthenticationError('Password must be at least 8 characters long');
      }
      user = {
        id: `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        email: normalized,
        password,
        username: normalized.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_'),
        fullName: normalized.split('@')[0],
        gender: 'other',
        role: 'student',
        createdAt: new Date().toISOString(),
      };
      this.users.set(normalized, user);
      logger.info(`[DevInMemoryAuthAdapter] Auto-provisioned local user: ${normalized}`);
    } else if (user.password !== password) {
      throw new AuthenticationError('Invalid email or password');
    }

    const session = this.createSession(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.fullName,
        gender: user.gender,
        role: user.role,
      },
      session,
    };
  }

  async signUp(credentials: SignupCredentials): Promise<AuthResponse> {
    const normalized = credentials.email.toLowerCase().trim();
    if (this.users.has(normalized)) {
      throw new AuthenticationError('This email is already in use');
    }

    const user = {
      id: `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      email: normalized,
      password: credentials.password,
      username: credentials.username.trim().toLowerCase().replace(/\s+/g, '_'),
      fullName: credentials.fullName.trim(),
      gender: credentials.gender,
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    this.users.set(normalized, user);

    const session = this.createSession(user);
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.fullName,
        gender: user.gender,
        role: user.role,
      },
      session,
    };
  }

  async getUser(token: string): Promise<VerifiedUser> {
    try {
      const decoded = jwt.verify(token, this.signingSecret) as any;
      const user = Array.from(this.users.values()).find(u => u.id === decoded.sub || u.email === decoded.email);
      if (!user) {
        return {
          id: decoded.sub || 'dev-unknown',
          email: decoded.email || 'dev@soma.internal',
          username: decoded.username || 'dev_user',
          full_name: decoded.full_name || 'Dev User',
          gender: 'other',
          role: decoded.role || 'student',
        };
      }
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.fullName,
        gender: user.gender,
        role: user.role,
      };
    } catch {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  async refreshSession(refreshToken: string): Promise<{ access_token: string; expires_at: number }> {
    const parts = refreshToken.split('::');
    if (parts.length < 2 || parts[0] !== 'dev-refresh') {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
    const userId = parts[1];
    const user = Array.from(this.users.values()).find(u => u.id === userId);
    if (!user) {
      throw new AuthenticationError('User not found for refresh token');
    }
    const session = this.createSession(user);
    return {
      access_token: session.access_token,
      expires_at: session.expires_at,
    };
  }

  async signOut(): Promise<void> {
    // In-memory logout is stateless
  }

  async resetPassword(email: string, _redirectTo?: string): Promise<void> {
    logger.info(`[DevInMemoryAuthAdapter] Simulated password reset link for: ${email}`);
  }

  async updatePassword(password: string): Promise<void> {
    logger.info(`[DevInMemoryAuthAdapter] Simulated password update: length=${password.length}`);
  }

  private createSession(user: { id: string; email: string; role: string }): AuthSession {
    const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 3600; // 7 days
    const access_token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        aud: 'authenticated',
        iss: 'soma-dev-auth',
      },
      this.signingSecret,
      { expiresIn: '7d' }
    );
    const refresh_token = `dev-refresh::${user.id}::${Date.now()}`;
    return {
      access_token,
      refresh_token,
      expires_at: expiresAt,
      token_type: 'bearer',
    };
  }
}

// ── AuthService Class (The Deep Module) ────────────────────────────────────────

export class AuthService {
  private primaryAdapter: AuthAdapter;
  private devFallbackAdapter: DevInMemoryAuthAdapter;
  private isDevMode: boolean;

  constructor(adapterOrClient: AuthAdapter | SupabaseClient, isDevMode = process.env.NODE_ENV !== 'production') {
    this.isDevMode = isDevMode;
    this.devFallbackAdapter = new DevInMemoryAuthAdapter();

    if ('signIn' in adapterOrClient) {
      this.primaryAdapter = adapterOrClient;
    } else {
      this.primaryAdapter = new SupabaseAuthAdapter(adapterOrClient);
    }
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    logger.info(`Login attempt for email: ${credentials.email}`);
    try {
      const response = await this.primaryAdapter.signIn(credentials.email, credentials.password);
      logger.info(`Login successful for user: ${response.user.id}`);
      return response;
    } catch (err: any) {
      // In development mode, if Supabase is unreachable (DNS resolution / offline),
      // seamlessly fall back to the in-memory dev adapter so development is unblocked.
      if (this.isDevMode && err instanceof ExternalServiceError) {
        logger.warn(
          `⚠️ Downstream identity service is unreachable (${err.message}). ` +
          `Falling back to DevInMemoryAuthAdapter for local development.`
        );
        return await this.devFallbackAdapter.signIn(credentials.email, credentials.password);
      }
      throw err;
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    logger.info(`Signup attempt for email: ${credentials.email}`);
    try {
      const response = await this.primaryAdapter.signUp(credentials);
      logger.info(`Signup successful for user: ${response.user.id}`);
      return response;
    } catch (err: any) {
      if (this.isDevMode && err instanceof ExternalServiceError) {
        logger.warn(
          `⚠️ Downstream identity service is unreachable (${err.message}). ` +
          `Falling back to DevInMemoryAuthAdapter for local development.`
        );
        return await this.devFallbackAdapter.signUp(credentials);
      }
      throw err;
    }
  }

  async verifyToken(token: string): Promise<VerifiedUser> {
    try {
      return await this.primaryAdapter.getUser(token);
    } catch (err: any) {
      if (this.isDevMode) {
        try {
          return await this.devFallbackAdapter.getUser(token);
        } catch {
          // Dev adapter verification failed, fall through to rethrow primary error
        }
      }
      throw err;
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access_token: string; expires_at: number }> {
    try {
      return await this.primaryAdapter.refreshSession(refreshToken);
    } catch (err: any) {
      if (this.isDevMode && (err instanceof ExternalServiceError || refreshToken.startsWith('dev-refresh::'))) {
        return await this.devFallbackAdapter.refreshSession(refreshToken);
      }
      throw err;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.primaryAdapter.signOut();
    } catch (err) {
      if (!this.isDevMode) throw err;
    }
    logger.info('User logged out successfully');
  }

  async resetPassword(email: string, redirectTo?: string): Promise<void> {
    try {
      await this.primaryAdapter.resetPassword(email, redirectTo);
    } catch (err: any) {
      if (this.isDevMode && err instanceof ExternalServiceError) {
        await this.devFallbackAdapter.resetPassword(email, redirectTo);
        return;
      }
      throw err;
    }
  }

  async updatePassword(password: string): Promise<void> {
    try {
      await this.primaryAdapter.updatePassword(password);
    } catch (err: any) {
      if (this.isDevMode && err instanceof ExternalServiceError) {
        await this.devFallbackAdapter.updatePassword(password);
        return;
      }
      throw err;
    }
  }
}

// ── Factory & Singleton ────────────────────────────────────────────────────────

export function createAuthService(
  adapterOrClient: AuthAdapter | SupabaseClient,
  isDevMode?: boolean
): AuthService {
  return new AuthService(adapterOrClient, isDevMode);
}

function buildProductionClient(): SupabaseClient {
  if (!config.supabaseUrl || !config.supabaseUrl.startsWith('http')) {
    return new Proxy({} as SupabaseClient, {
      get: (_target, prop) => {
        if (prop === 'then') return undefined;
        throw new Error(
          `AuthService: Supabase is not configured. ` +
          `Set SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment.`
        );
      },
    });
  }

  return createClient(
    config.supabaseUrl,
    config.supabaseServiceKey || config.supabaseAnonKey,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { 'X-Client-Info': 'soma-backend' } },
    }
  );
}

export const authService = createAuthService(buildProductionClient());
export default authService;
