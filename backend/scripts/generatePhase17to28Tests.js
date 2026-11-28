import fs from 'fs';
import path from 'path';

const NEW_STATES = [
  { slug: 'meghalaya', name: 'Meghalaya', file: 'meghalayaPilot.test.js', count: 12 },
  { slug: 'mizoram', name: 'Mizoram', file: 'mizoramPilot.test.js', count: 11 },
  { slug: 'nagaland', name: 'Nagaland', file: 'nagalandPilot.test.js', count: 17 },
  { slug: 'odisha', name: 'Odisha', file: 'odishaPilot.test.js', count: 30 },
  { slug: 'punjab', name: 'Punjab', file: 'punjabPilot.test.js', count: 23 },
  { slug: 'rajasthan', name: 'Rajasthan', file: 'rajasthanPilot.test.js', count: 41 },
  { slug: 'sikkim', name: 'Sikkim', file: 'sikkimPilot.test.js', count: 6 },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', file: 'tamilNaduPilot.test.js', count: 38 },
  { slug: 'telangana', name: 'Telangana', file: 'telanganaPilot.test.js', count: 33 },
  { slug: 'tripura', name: 'Tripura', file: 'tripuraPilot.test.js', count: 8 },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', file: 'uttarPradeshPilot.test.js', count: 75 },
  { slug: 'uttarakhand', name: 'Uttarakhand', file: 'uttarakhandPilot.test.js', count: 13 }
];

function generateTestFile(state) {
  return `import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { closePool } from '../src/config/db.js';
import { serializeDistrict } from '../src/utils/serializer.js';

describe('${state.name} CIMS Image System - Regression & Verification Suite', () => {
  after(async () => {
    await closePool();
  });

  test('TEST 1 & 2: GET /api/states/${state.slug}/districts returns exactly ${state.count} districts with valid CIMS mappings', async () => {
    const res = await request(app).get('/api/states/${state.slug}/districts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, ${state.count});

    const districts = res.body.data;
    const seenUrls = new Set();
    const seenImageIds = new Set();

    for (const d of districts) {
      assert.ok(d.id, \`District \${d.name} missing ID\`);
      assert.ok(d.name, \`District missing name\`);
      assert.ok(d.slug, \`District missing slug\`);
      assert.ok(d.onlineImageId, \`District \${d.name} missing onlineImageId\`);
      assert.ok(d.image, \`District \${d.name} missing image URL\`);
      assert.ok(d.thumbnailUrl, \`District \${d.name} missing thumbnail URL\`);
      assert.ok(d.photographer, \`District \${d.name} missing photographer credit\`);
      assert.ok(d.license, \`District \${d.name} missing license metadata\`);

      assert.match(d.image, /^https:\\/\\/(upload|thumb)\\.wikimedia\\.org\\//, \`District \${d.name} image not from Wikimedia\`);
      assert.match(d.thumbnailUrl, /^https:\\/\\/(upload|thumb)\\.wikimedia\\.org\\//, \`District \${d.name} thumbnail not from Wikimedia\`);

      seenUrls.add(d.image);
      seenImageIds.add(d.onlineImageId);
    }

    assert.equal(seenUrls.size, ${state.count}, 'Expected ${state.count} unique district primary image URLs');
    assert.equal(seenImageIds.size, ${state.count}, 'Expected ${state.count} unique district online image IDs');
  });

  test('TEST 3: GET /api/states/${state.slug} returns verified state hero and card images from CIMS', async () => {
    const res = await request(app).get('/api/states/${state.slug}');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, '${state.name}');

    const stateRecord = res.body.data;
    assert.match(stateRecord.heroImage, /^https:\\/\\/(upload|thumb)\\.wikimedia\\.org\\//);
    assert.match(stateRecord.image, /^https:\\/\\/(upload|thumb)\\.wikimedia\\.org\\//);
  });

  test('TEST 4: Non-pilot territory serialization fallback preserves static image URL', () => {
    const mockRow = { id: 999, name: 'Control District', image_url: '/assets/images/control.jpg' };
    const mockState = { slug: 'delhi', name: 'Delhi' };
    const serialized = serializeDistrict(mockRow, mockState);
    assert.equal(serialized.onlineImageId, null);
    assert.equal(serialized.image, '/assets/images/control.jpg');
  });
});
`;
}

// 1. Create the 12 new test suites
for (const s of NEW_STATES) {
  const filePath = path.resolve('backend/tests', s.file);
  fs.writeFileSync(filePath, generateTestFile(s), 'utf8');
  console.log(`✓ Created test suite: ${s.file}`);
}

// 2. Update existing tests that had Meghalaya as non-pilot check
const testDir = path.resolve('backend/tests');
const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js') && !NEW_STATES.some(ns => ns.file === f));

for (const f of files) {
  const p = path.join(testDir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('Non-pilot states (Meghalaya)')) {
    // Replace non-pilot test block with UT / serializer fallback check
    content = content.replace(
      /test\('TEST \d+: Non-pilot states \(Meghalaya\) remain (?:100% )?unchanged'[\s\S]*?\}\);/g,
      `test('Non-pilot territory fallback preserves static image URL', () => {
    const mockRow = { id: 999, name: 'Control District', image_url: '/assets/images/control.jpg' };
    const mockState = { slug: 'delhi', name: 'Delhi' };
    const serialized = serializeDistrict(mockRow, mockState);
    assert.equal(serialized.onlineImageId, null);
    assert.equal(serialized.image, '/assets/images/control.jpg');
  });`
    );
    if (!content.includes('serializeDistrict')) {
      content = content.replace("import app from '../src/app.js';", "import app from '../src/app.js';\nimport { serializeDistrict } from '../src/utils/serializer.js';");
    }
    fs.writeFileSync(p, content, 'utf8');
    console.log(`✓ Updated non-pilot test in: ${f}`);
  }
}

console.log('All test suites created and updated successfully!');
