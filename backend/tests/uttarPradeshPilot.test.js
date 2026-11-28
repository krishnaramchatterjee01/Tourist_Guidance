import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';
import { serializeDistrict } from '../src/utils/serializer.js';

describe('Uttar Pradesh CIMS Image System - Regression & Verification Suite', () => {
  after(async () => {
    await closePool();
  });

  test('TEST 1 & 2: GET /api/states/uttar-pradesh/districts returns exactly 75 districts with valid CIMS mappings', async () => {
    const res = await request(app).get('/api/states/uttar-pradesh/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 75);

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

      assert.match(d.image, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//, `District ${d.name} image not from Wikimedia`);
      assert.match(d.thumbnailUrl, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//, `District ${d.name} thumbnail not from Wikimedia`);

      seenUrls.add(d.image);
      seenImageIds.add(d.onlineImageId);
    }

    assert.equal(seenUrls.size, 75, 'Expected 75 unique district primary image URLs');
    assert.equal(seenImageIds.size, 75, 'Expected 75 unique district online image IDs');
  });

  test('TEST 3: GET /api/states/uttar-pradesh returns verified state hero and card images from CIMS', async () => {
    const res = await request(app).get('/api/states/uttar-pradesh');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Uttar Pradesh');

    const stateRecord = res.body.data;
    assert.match(stateRecord.heroImage, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//);
    assert.match(stateRecord.image, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//);
  });

  test('TEST 4: Non-pilot territory serialization fallback preserves static image URL', () => {
    const mockRow = { id: 999, name: 'Control District', image_url: '/assets/images/control.jpg' };
    const mockState = { slug: 'non-pilot-territory', name: 'Non Pilot Territory' };
    const serialized = serializeDistrict(mockRow, mockState);
    assert.equal(serialized.onlineImageId, null);
    assert.equal(serialized.image, '/assets/images/control.jpg');
  });
});
