import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

describe('Explore India REST API - Unit & Route Tests', () => {
  after(async () => {
    await closePool();
  });
  test('GET /api/health should return 200 with UP status', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.status, 'UP');
    assert.ok(res.body.timestamp);
  });

  test('GET /api/ready returns 200 or 503 JSON without crashing', async () => {
    const res = await request(app).get('/api/ready');
    assert.ok(res.status === 200 || res.status === 503);
    assert.equal(typeof res.body.success, 'boolean');
    assert.ok(res.body.status);
  });

  test('GET /api/nonexistent-endpoint should return 404 JSON (not HTML)', async () => {
    const res = await request(app).get('/api/nonexistent-endpoint');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.ok(res.body.message.includes('not found'));
    // Crucial check: must NOT return HTML SPA
    assert.match(res.headers['content-type'], /application\/json/);
  });

  test('GET /api/search with empty query should return empty array', async () => {
    const res = await request(app).get('/api/search?q=');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.deepEqual(res.body.data, []);
  });
});
