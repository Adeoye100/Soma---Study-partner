import express from 'express';
import request from 'supertest';
import feedbackRouter from './feedback';

const app = express();
app.use(express.json());
app.use('/api/feedback', feedbackRouter);

describe('Feedback Route API', () => {
  describe('GET /api/feedback/health', () => {
    it('returns 200 and healthy status', async () => {
      const res = await request(app).get('/api/feedback/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('feedback-service');
      expect(res.body).toHaveProperty('emailProviders');
    });
  });

  describe('POST /api/feedback', () => {
    it('successfully accepts valid feedback from an anonymous user', async () => {
      const payload = {
        type: 'bug_report',
        title: 'Formula rendering issue on Safari',
        description: 'LaTeX mathematical formulas in the Physics exam do not display properly.',
        severity: 'medium',
        page_url: 'https://smart-examination.app/exam/123',
      };

      const res = await request(app)
        .post('/api/feedback')
        .send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.feedbackId).toBeDefined();
      expect(typeof res.body.feedbackId).toBe('string');
      expect(res.body.message).toContain('successfully');
    });

    it('rejects submissions with missing required fields', async () => {
      const res = await request(app)
        .post('/api/feedback')
        .send({
          type: 'bug_report',
          // title missing
          description: 'A problem occurred with question loading.',
          severity: 'high',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing required fields');
    });

    it('rejects submissions with short titles or short descriptions', async () => {
      const shortTitleRes = await request(app)
        .post('/api/feedback')
        .send({
          type: 'ui_issue',
          title: 'Hi',
          description: 'Valid length description of the problem encountered.',
          severity: 'low',
        });

      expect(shortTitleRes.status).toBe(400);
      expect(shortTitleRes.body.error).toBe('Validation Error');

      const shortDescRes = await request(app)
        .post('/api/feedback')
        .send({
          type: 'ui_issue',
          title: 'Valid Title Here',
          description: 'Tiny',
          severity: 'low',
        });

      expect(shortDescRes.status).toBe(400);
      expect(shortDescRes.body.error).toBe('Validation Error');
    });

    it('sanitizes malicious script tags and HTML in title and description', async () => {
      const maliciousPayload = {
        type: 'bug_report',
        title: '<script>alert("xss")</script> Broken button',
        description: '<img src=x onerror=alert(1)> When clicking submit exam button, nothing happens.',
        severity: 'high',
      };

      const res = await request(app)
        .post('/api/feedback')
        .send(maliciousPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.feedbackId).toBeDefined();
    });
  });
});
