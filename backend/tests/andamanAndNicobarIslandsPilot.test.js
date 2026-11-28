import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';
import { serializeDistrict } from '../src/utils/serializer.js';

describe('Andaman and Nicobar Islands CIMS Image System - Regression & Verification Suite', () => {
  after(async () => {
    await closePool();
  });

  test('TEST 1 & 2: GET /api/states/andaman-and-nicobar-islands/districts returns exactly 3 districts with valid CIMS mappings', async () => {
    const res = await request(app).get('/api/states/andaman-and-nicobar-islands/districts');
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

      assert.match(d.image, /^https:\/\/(upload|thumb)\.wikimedia\.org\//, `District ${d.name} image not from Wikimedia`);
      assert.match(d.thumbnailUrl, /^https:\/\/(upload|thumb)\.wikimedia\.org\//, `District ${d.name} thumbnail not from Wikimedia`);

      seenUrls.add(d.image);
      seenImageIds.add(d.onlineImageId);
    }

    assert.equal(seenUrls.size, 3, 'Expected 3 unique district primary image URLs');
    assert.equal(seenImageIds.size, 3, 'Expected 3 unique district online image IDs');
  });

  test('TEST 3: GET /api/states/andaman-and-nicobar-islands returns verified state hero and card images from CIMS', async () => {
    const res = await request(app).get('/api/states/andaman-and-nicobar-islands');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Andaman and Nicobar Islands');

    const stateRecord = res.body.data;
    assert.match(stateRecord.heroImage, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
    assert.match(stateRecord.image, /^https:\/\/(upload|thumb)\.wikimedia\.org\//);
  });

  test('TEST 4: Non-pilot territory serialization fallback preserves static image URL', () => {
    const mockRow = { id: 999, name: 'Control District', image_url: '/assets/images/control.jpg' };
    const mockState = { slug: 'non-pilot-territory', name: 'Non Pilot Territory' };
    const serialized = serializeDistrict(mockRow, mockState);
    assert.equal(serialized.onlineImageId, null);
    assert.equal(serialized.image, '/assets/images/control.jpg');
  });
});
