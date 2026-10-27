import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import authRouter from './auth';
import { authService } from '@/services/authService';
import { ExternalServiceError } from '@/shared/errors';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRouter);

describe('Auth Route API', () => {
  describe('POST /api/auth/login', () => {
    it('rejects requests with missing credentials with 400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: '' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('MISSING_CREDENTIALS');
    });

    it('rejects invalid email formats with 400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'notanemail', password: 'password123' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('INVALID_EMAIL');
    });

    it('rejects passwords shorter than 8 characters with 400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'short' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('WEAK_PASSWORD');
    });

    it('returns 503 Service Unavailable when identity provider throws ExternalServiceError', async () => {
      const loginSpy = jest.spyOn(authService, 'login').mockRejectedValueOnce(
        new ExternalServiceError(
          'Supabase Auth',
          'Downstream DNS lookup failed (ENOTFOUND ocuoseyzhmxnohjyccus.supabase.co)'
        )
      );

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(503);
      expect(res.body.error).toBe('Service Unavailable');
      expect(res.body.code).toBe('AUTH_SERVICE_UNAVAILABLE');

      loginSpy.mockRestore();
    });

    it('logs in successfully in development fallback mode', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'dev@soma.internal', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('dev@soma.internal');
      expect(res.body.data.session).toBeDefined();
    });
  });

  describe('POST /api/auth/signup', () => {
    it('rejects registration with missing fields with 400', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('MISSING_FIELDS');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('returns 200 on logout', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
