import { getPool, closePool } from '../src/config/db.js';
import fs from 'fs';
import path from 'path';

async function audit() {
  try {
    const pool = getPool();
    const targetSlugs = [
      'haryana',
      'himachal-pradesh',
      'jharkhand',
      'karnataka',
      'kerala',
      'madhya-pradesh',
      'maharashtra',
      'manipur'
    ];

    const [states] = await pool.query(
      'SELECT id, name, slug FROM states WHERE slug IN (?) ORDER BY FIELD(slug, ?)',
      [targetSlugs, targetSlugs]
    );

    console.log('=== TARGET STATES AUDIT ===');
    const summary = {};

    for (const state of states) {
      const [districts] = await pool.query(
        'SELECT id, name, slug FROM districts WHERE state_id = ? ORDER BY id ASC',
        [state.id]
      );
      const [existingEntityImages] = await pool.query(
        'SELECT count(*) as count FROM entity_images WHERE state_id = ? AND is_active = 1',
        [state.id]
      );

      summary[state.slug] = {
        id: state.id,
        name: state.name,
        slug: state.slug,
        districtCount: districts.length,
        districts: districts.map(d => ({ id: d.id, name: d.name, slug: d.slug })),
        activeEntityImages: existingEntityImages[0].count
      };

      console.log(`[${state.name}] (id: ${state.id}, slug: ${state.slug}): ${districts.length} districts, ${existingEntityImages[0].count} active images`);
    }

    // Save baseline checkpoint
    const checkpointPath = path.resolve('docs/CIMS_PHASE_9_TO_16_CHECKPOINT.json');
    const initialCheckpoint = {
      version: '7.1',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_phase: 'phase_9_haryana',
      states: summary,
      phase_status: {
        phase_9_haryana: { status: 'pending', total_districts: summary['haryana']?.districtCount || 0 },
        phase_10_himachal_pradesh: { status: 'pending', total_districts: summary['himachal-pradesh']?.districtCount || 0 },
        phase_11_jharkhand: { status: 'pending', total_districts: summary['jharkhand']?.districtCount || 0 },
        phase_12_karnataka: { status: 'pending', total_districts: summary['karnataka']?.districtCount || 0 },
        phase_13_kerala: { status: 'pending', total_districts: summary['kerala']?.districtCount || 0 },
        phase_14_madhya_pradesh: { status: 'pending', total_districts: summary['madhya-pradesh']?.districtCount || 0 },
        phase_15_maharashtra: { status: 'pending', total_districts: summary['maharashtra']?.districtCount || 0 },
        phase_16_manipur: { status: 'pending', total_districts: summary['manipur']?.districtCount || 0 }
      }
    };

    fs.writeFileSync(checkpointPath, JSON.stringify(initialCheckpoint, null, 2));
    console.log(`Saved baseline checkpoint to ${checkpointPath}`);

    // Also write districts json per state for easy reference during curation
    fs.writeFileSync(path.resolve('docs/target_districts_baseline.json'), JSON.stringify(summary, null, 2));
    console.log('Saved baseline districts to docs/target_districts_baseline.json');

    await closePool();
    process.exit(0);
  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
}

audit();
