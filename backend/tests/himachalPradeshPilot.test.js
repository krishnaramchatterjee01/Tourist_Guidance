import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

describe('Himachal Pradesh CIMS Image System - Regression & Verification Suite', () => {
  after(async () => {
    await closePool();
  });

  test('TEST 1 & 2: GET /api/states/himachal-pradesh/districts returns exactly 12 districts with valid CIMS mappings', async () => {
    const res = await request(app).get('/api/states/himachal-pradesh/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 12);

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

    assert.equal(seenUrls.size, 12, 'Expected 12 unique district primary image URLs');
    assert.equal(seenImageIds.size, 12, 'Expected 12 unique district online image IDs');
  });

  test('TEST 3: GET /api/states/himachal-pradesh returns verified state hero and card images from CIMS', async () => {
    const res = await request(app).get('/api/states/himachal-pradesh');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Himachal Pradesh');

    const state = res.body.data;
    assert.match(state.heroImage, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
    assert.match(state.image, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
  });
});
