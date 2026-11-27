import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

describe('Haryana CIMS Image System - Regression & Verification Suite', () => {
  after(async () => {
    await closePool();
  });

  test('TEST 1 & 2: GET /api/states/haryana/districts returns exactly 23 districts with valid CIMS mappings', async () => {
    const res = await request(app).get('/api/states/haryana/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 23);

    const districts = res.body.data;
    const seenUrls = new Set();
    const seenImageIds = new Set();

    for (const d of districts) {
      assert.ok(d.id, `District ${d.name} missing ID`);
      assert.ok(d.name, `District missing name`);
      assert.ok(d.slug, `District missing slug`);
      assert.ok(d.onlineImageId, `District ${d.name} missing onlineImageId`);
      assert.ok(d.image, `District ${d.name} missing image URL`);
      assert.ok(d.thumbnailUrl, `District ${d.name} missing thumbnail URL`);
      assert.ok(d.photographer, `District ${d.name} missing photographer credit`);
      assert.ok(d.license, `District ${d.name} missing license metadata`);

      assert.match(d.image, /^https:\/\/(upload|thumb)\.wikimedia\.org\//, `District ${d.name} image not from Wikimedia`);
      assert.match(d.thumbnailUrl, /^https:\/\/(upload|thumb)\.wikimedia\.org\//, `District ${d.name} thumbnail not from Wikimedia`);

      seenUrls.add(d.image);
      seenImageIds.add(d.onlineImageId);
    }

    assert.equal(seenUrls.size, 23, 'Expected 23 unique district primary image URLs');
    assert.equal(seenImageIds.size, 23, 'Expected 23 unique district online image IDs');
  });

  test('TEST 3: GET /api/states/haryana returns verified state hero and card images from CIMS', async () => {
    const res = await request(app).get('/api/states/haryana');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Haryana');

    const state = res.body.data;
    assert.match(state.heroImage, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
    assert.match(state.image, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
  });

  test('TEST 4: Non-pilot states (Meghalaya) remain unchanged', async () => {
    const res = await request(app).get('/api/states/meghalaya/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.length > 0);
    assert.equal(res.body.data[0].onlineImageId, null);
  });
});
