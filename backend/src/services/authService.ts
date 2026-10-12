/**
 * AuthService — deep module for all Supabase Auth operations.
 *
 * Design contract:
 *  - Receives a SupabaseClient at construction time (never creates its own).
 *  - Single token-verification path: verifyToken() calls Supabase auth.getUser().
 *  - The verifyJWT / generateJWT local-JWT fork has been removed; the app uses
 *    Supabase JWTs exclusively.
 *  - Testable: pass a fake/mock SupabaseClient in tests — no network required.
 *
 * Factory:
 *  - createAuthService(client) — inject any SupabaseClient
 *  - authService            — production singleton wired from config
 */
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { config } from '@/config';
import { AuthenticationError } from '@/shared/errors';
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

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username?: string;
    full_name?: string;
    gender?: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    token_type: string;
  } | null;
}

export interface VerifiedUser {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  gender?: string;
  role: string;
}

// ── AuthService class ──────────────────────────────────────────────────────────

export class AuthService {
  constructor(private readonly supabase: SupabaseClient) {}

  // ── Login ────────────────────────────────────────────────────────────────

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    logger.info(`Login attempt for email: ${credentials.email}`);

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email.toLowerCase().trim(),
      password: credentials.password,
    });

    if (error) {
      logger.warn(`Login failed for ${credentials.email}: ${error.message}`);
      throw this.mapAuthError(error);
    }

    if (!data.user || !data.session) {
      throw new AuthenticationError('Invalid login response from authentication service');
    }

    const profile = await this.getUserProfile(data.user.id);
    logger.info(`Login successful for user: ${data.user.id}`);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        username: profile?.username,
        full_name: profile?.full_name,
        gender: profile?.gender,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token!,
        expires_at: data.session.expires_at!,
        token_type: data.session.token_type,
      },
    };
  }

  // ── Signup ───────────────────────────────────────────────────────────────

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    logger.info(`Signup attempt for email: ${credentials.email}`);

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
      logger.warn(`Signup failed for ${credentials.email}: ${error.message}`);
      throw this.mapAuthError(error);
    }

    // Email confirmation pending — session is null until confirmed
    if (data.user && !data.session) {
      return { user: { id: data.user.id, email: data.user.email! }, session: null };
    }

    if (!data.user || !data.session) {
      throw new AuthenticationError('Invalid signup response from authentication service');
    }

    const profile = await this.getUserProfile(data.user.id);
    logger.info(`Signup successful for user: ${data.user.id}`);

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        username: profile?.username,
        full_name: profile?.full_name,
        gender: profile?.gender,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token!,
        expires_at: data.session.expires_at!,
        token_type: data.session.token_type,
      },
    };
  }

  // ── Token verification — single path ─────────────────────────────────────

  /**
   * Verify a Supabase access token and return the authenticated user.
   *
   * This is the ONLY token-verification method. The local-JWT fork
   * (verifyJWT / generateJWT) has been removed — the app uses Supabase
   * JWTs exclusively. See auth middleware in middleware/auth.ts.
   */
  async verifyToken(token: string): Promise<VerifiedUser> {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser(token);

    if (error || !user) {
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

  // ── Token refresh ─────────────────────────────────────────────────────────

  async refreshToken(
    refreshToken: string
  ): Promise<{ access_token: string; expires_at: number }> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw this.mapAuthError(error ?? new Error('Invalid refresh response'));
    }

    return {
      access_token: data.session.access_token,
      expires_at: data.session.expires_at!,
    };
  }

  // ── Logout ────────────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw this.mapAuthError(error);
    logger.info('User logged out successfully');
  }

  // ── Password management ───────────────────────────────────────────────────

  async resetPassword(email: string, redirectTo?: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo ?? `${config.host}/reset-password`,
    });
    if (error) throw this.mapAuthError(error);
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.supabase.auth.updateUser({ password });
    if (error) throw this.mapAuthError(error);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

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

  private mapAuthError(error: any): AuthenticationError {
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

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Create an AuthService with an explicitly injected client.
 * Use this in tests: createAuthService(fakeSupabaseClient).
 */
export function createAuthService(client: SupabaseClient): AuthService {
  return new AuthService(client);
}

// ── Production singleton ──────────────────────────────────────────────────────

/**
 * Builds the production Supabase client from environment config.
 * Returns a proxy that throws clearly on first use (not at import) if
 * the env vars are missing, instead of silently constructing a broken client.
 */
function buildProductionClient(): SupabaseClient {
  if (!config.supabaseUrl || !config.supabaseUrl.startsWith('http')) {
    return new Proxy({} as SupabaseClient, {
      get: (_target, prop) => {
        if (prop === 'then') return undefined; // don't break await checks
        throw new Error(
          `AuthService: Supabase is not configured. ` +
          `Set SUPABASE_URL and SUPABASE_SERVICE_KEY in your environment. ` +
          `Cannot access property "${String(prop)}".`
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
