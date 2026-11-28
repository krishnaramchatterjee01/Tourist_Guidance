import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { serializeDistrict } from '../src/utils/serializer.js';
import { closePool } from '../src/config/db.js';

describe('Assam CIMS Image System - Regression & Verification Suite', () => {
  after(async () => {
    await closePool();
  });

  test('TEST 1 & 2: GET /api/states/assam/districts returns exactly 35 districts with valid CIMS mappings', async () => {
    const res = await request(app).get('/api/states/assam/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 35);

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

      // Must be remote URL from approved CDN
      assert.match(d.image, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//, `District ${d.name} image not from Wikimedia`);
      assert.match(d.thumbnailUrl, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//, `District ${d.name} thumbnail not from Wikimedia`);

      seenUrls.add(d.image);
      seenImageIds.add(d.onlineImageId);
    }

    // TEST 3: All 35 districts must have 100% unique primary image URLs and IDs
    assert.equal(seenUrls.size, 35, 'Expected 35 unique district primary image URLs');
    assert.equal(seenImageIds.size, 35, 'Expected 35 unique district online image IDs');
  });

  test('TEST 4: GET /api/states/assam returns verified state hero and card images from CIMS', async () => {
    const res = await request(app).get('/api/states/assam');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Assam');

    const state = res.body.data;
    assert.match(state.heroImage, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//);
    assert.match(state.image, /^https:\/\/(?:(?:upload|thumb)\.wikimedia\.org|live\.staticflickr\.com|images\.unsplash\.com|pd\.w\.org)\//);
  });

  test('TEST 5: West Bengal Pilot (Phase 1) remains 100% intact with 23 unique districts', async () => {
    const res = await request(app).get('/api/states/west-bengal/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 23);

    const urls = new Set(res.body.data.map(d => d.image));
    assert.equal(urls.size, 23, 'Expected 23 unique WB district images');
  });

  test('TEST 6: Andhra Pradesh Pilot (Phase 2) remains 100% intact with 28 unique districts', async () => {
    const res = await request(app).get('/api/states/andhra-pradesh/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 28);

    const urls = new Set(res.body.data.map(d => d.image));
    assert.equal(urls.size, 28, 'Expected 28 unique AP district images');
  });

  test('TEST 7: Arunachal Pradesh Pilot (Phase 3) remains 100% intact with 27 unique districts', async () => {
    const res = await request(app).get('/api/states/arunachal-pradesh/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 27);

    const urls = new Set(res.body.data.map(d => d.image));
    assert.equal(urls.size, 27, 'Expected 27 unique Arunachal district images');
  });

  test('Non-pilot territory fallback preserves static image URL', () => {
    const mockRow = { id: 999, name: 'Control District', image_url: '/assets/images/control.jpg' };
    const mockState = { slug: 'non-pilot-territory', name: 'Non Pilot Territory' };
    const serialized = serializeDistrict(mockRow, mockState);
    assert.equal(serialized.onlineImageId, null);
    assert.equal(serialized.image, '/assets/images/control.jpg');
  });
});
