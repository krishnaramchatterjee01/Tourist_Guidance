import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';

describe('Goa CIMS Image System - Regression & Verification Suite', () => {
  after(async () => {
    await closePool();
  });

  test('TEST 1 & 2: GET /api/states/goa/districts returns exactly 3 districts with valid CIMS mappings', async () => {
    const res = await request(app).get('/api/states/goa/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 3);

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
      assert.match(d.image, /^https:\/\/(upload|thumb)\.wikimedia\.org\//, `District ${d.name} image not from Wikimedia`);
      assert.match(d.thumbnailUrl, /^https:\/\/(upload|thumb)\.wikimedia\.org\//, `District ${d.name} thumbnail not from Wikimedia`);

      // Must NOT be the cloned local file
      assert.notEqual(d.image, `/images/districts/goa/${d.slug}.jpg`);

      seenUrls.add(d.image);
      seenImageIds.add(d.onlineImageId);
    }

    // TEST 3: All 3 districts must have 100% unique primary image URLs and IDs
    assert.equal(seenUrls.size, 3, 'Expected 3 unique district primary image URLs');
    assert.equal(seenImageIds.size, 3, 'Expected 3 unique district online image IDs');
  });

  test('TEST 4: GET /api/states/goa returns verified state hero and card images from CIMS', async () => {
    const res = await request(app).get('/api/states/goa');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Goa');

    const state = res.body.data;
    assert.match(state.heroImage, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
    assert.match(state.image, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
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

  test('TEST 8: Assam Pilot (Phase 4) remains 100% intact with 35 unique districts', async () => {
    const res = await request(app).get('/api/states/assam/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 35);

    const urls = new Set(res.body.data.map(d => d.image));
    assert.equal(urls.size, 35, 'Expected 35 unique Assam district images');
  });

  test('TEST 9: Bihar Pilot (Phase 5) remains 100% intact with 38 unique districts', async () => {
    const res = await request(app).get('/api/states/bihar/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 38);

    const urls = new Set(res.body.data.map(d => d.image));
    assert.equal(urls.size, 38, 'Expected 38 unique Bihar district images');
  });

  test('TEST 10: Chhattisgarh Pilot (Phase 6) remains 100% intact with 33 unique districts', async () => {
    const res = await request(app).get('/api/states/chhattisgarh/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 33);

    const urls = new Set(res.body.data.map(d => d.image));
    assert.equal(urls.size, 33, 'Expected 33 unique Chhattisgarh district images');
  });

  test('TEST 11: Non-pilot states (Meghalaya) remain 100% unchanged', async () => {
    const res = await request(app).get('/api/states/meghalaya/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.length > 0);

    // Non-pilot states should not have online CIMS mappings
    assert.equal(res.body.data[0].onlineImageId, null);
    assert.ok(res.body.data[0].image);
  });
});
