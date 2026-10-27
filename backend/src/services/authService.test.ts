import {
  AuthService,
  DevInMemoryAuthAdapter,
  SupabaseAuthAdapter,
  createAuthService,
} from './authService';
import { AuthenticationError, ExternalServiceError } from '@/shared/errors';

describe('AuthService & Auth Seam', () => {
  describe('DevInMemoryAuthAdapter', () => {
    let adapter: DevInMemoryAuthAdapter;

    beforeEach(() => {
      adapter = new DevInMemoryAuthAdapter('test-secret-123456');
    });

    it('authenticates seeded developer account successfully', async () => {
      const result = await adapter.signIn('dev@soma.internal', 'password123');
      expect(result.user.email).toBe('dev@soma.internal');
      expect(result.user.role).toBe('student');
      expect(result.session).toBeDefined();
      expect(result.session?.access_token).toBeDefined();
    });

    it('rejects seeded account with invalid password', async () => {
      await expect(
        adapter.signIn('dev@soma.internal', 'wrongpassword')
      ).rejects.toThrow(AuthenticationError);
    });

    it('auto-provisions new user on first login in development', async () => {
      const result = await adapter.signIn('newstudent@test.com', 'mypassword123');
      expect(result.user.email).toBe('newstudent@test.com');
      expect(result.session?.access_token).toBeDefined();

      // Subsequent login with wrong password fails
      await expect(
        adapter.signIn('newstudent@test.com', 'wrongpassword')
      ).rejects.toThrow(AuthenticationError);
    });

    it('creates new account on signUp and prevents duplicate email', async () => {
      const signupResult = await adapter.signUp({
        email: 'ade@soma.internal',
        password: 'securepassword123',
        username: 'ade_dev',
        fullName: 'Ade Developer',
        gender: 'male',
      });

      expect(signupResult.user.email).toBe('ade@soma.internal');
      expect(signupResult.user.username).toBe('ade_dev');

      await expect(
        adapter.signUp({
          email: 'ade@soma.internal',
          password: 'securepassword123',
          username: 'ade_dev2',
          fullName: 'Ade Another',
          gender: 'male',
        })
      ).rejects.toThrow(AuthenticationError);
    });

    it('verifies valid session token', async () => {
      const login = await adapter.signIn('dev@soma.internal', 'password123');
      const token = login.session!.access_token;

      const verified = await adapter.getUser(token);
      expect(verified.email).toBe('dev@soma.internal');
      expect(verified.role).toBe('student');
    });

    it('refreshes token with valid refresh token', async () => {
      const login = await adapter.signIn('dev@soma.internal', 'password123');
      const refreshToken = login.session!.refresh_token;

      const refreshed = await adapter.refreshSession(refreshToken);
      expect(refreshed.access_token).toBeDefined();
      expect(refreshed.expires_at).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('SupabaseAuthAdapter error classification', () => {
    it('classifies DNS resolution failure as ExternalServiceError', () => {
      const mockClient = {} as any;
      const adapter = new SupabaseAuthAdapter(mockClient);

      const dnsError = {
        name: 'AuthRetryableFetchError',
        message: 'fetch failed',
        status: 0,
        cause: {
          code: 'ENOTFOUND',
          hostname: 'ocuoseyzhmxnohjyccus.supabase.co',
        },
      };

      const classified = adapter.classifyError(dnsError);
      expect(classified).toBeInstanceOf(ExternalServiceError);
      expect(classified.message).toContain('Identity provider unreachable');
    });

    it('classifies invalid login credentials as AuthenticationError', () => {
      const mockClient = {} as any;
      const adapter = new SupabaseAuthAdapter(mockClient);

      const credError = {
        name: 'AuthApiError',
        message: 'Invalid login credentials',
        status: 400,
      };

      const classified = adapter.classifyError(credError);
      expect(classified).toBeInstanceOf(AuthenticationError);
      expect(classified.message).toBe('Invalid email or password');
    });
  });

  describe('AuthService Deep Module Seam & Dev Resilience', () => {
    it('falls back to DevInMemoryAuthAdapter in dev mode when downstream fails', async () => {
      // Mock failing Supabase client simulating ENOTFOUND
      const failingClient = {
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({
            data: { user: null, session: null },
            error: {
              name: 'AuthRetryableFetchError',
              message: 'fetch failed: ENOTFOUND ocuoseyzhmxnohjyccus.supabase.co',
              status: 0,
            },
          }),
        },
      } as any;

      const authService = createAuthService(failingClient, true /* isDevMode */);

      // Login succeeds seamlessly via DevInMemoryAuthAdapter fallback!
      const result = await authService.login({
        email: 'dev@soma.internal',
        password: 'password123',
      });

      expect(result.user.email).toBe('dev@soma.internal');
      expect(result.session?.access_token).toBeDefined();
    });

    it('propagates ExternalServiceError in production mode when downstream fails', async () => {
      const failingClient = {
        auth: {
          signInWithPassword: jest.fn().mockResolvedValue({
            data: { user: null, session: null },
            error: {
              name: 'AuthRetryableFetchError',
              message: 'fetch failed: ENOTFOUND ocuoseyzhmxnohjyccus.supabase.co',
              status: 0,
            },
          }),
        },
      } as any;

      const authService = createAuthService(failingClient, false /* isDevMode = false */);

      await expect(
        authService.login({
          email: 'user@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(ExternalServiceError);
    });
  });
});
