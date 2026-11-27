import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

describe('CIMS Image System - Route & Validation Tests', () => {
  after(async () => {
    await closePool();
  });

  test('POST /api/images/report-failure with missing/invalid imageId returns 400', async () => {
    const res = await request(app)
      .post('/api/images/report-failure')
      .send({ imageId: 'not-a-number' });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.includes('Invalid imageId'));
  });

  test('POST /api/admin/images/:id/verify with non-numeric ID returns 400', async () => {
    const res = await request(app)
      .post('/api/admin/images/abc/verify');

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.includes('Invalid image ID'));
  });

  test('GET /api/admin/images/overview returns JSON status without crash', async () => {
    const res = await request(app).get('/api/admin/images/overview');
    assert.ok(res.status === 200 || res.status === 500);
    assert.equal(typeof res.body.success, 'boolean');
  });

  test('GET /api/admin/images returns JSON status without crash', async () => {
    const res = await request(app).get('/api/admin/images');
    assert.ok(res.status === 200 || res.status === 500);
    assert.equal(typeof res.body.success, 'boolean');
  });
});
