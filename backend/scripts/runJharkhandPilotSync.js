import imageCollector from '../src/services/images/imageCollector.js';
import { closePool } from '../src/config/db.js';

async function main() {
  console.log('--- Running Jharkhand Pilot Collection ---');
  const result = await imageCollector.collectJharkhandPilot({ forceRefresh: false });
  console.log('Result:', JSON.stringify(result, null, 2));
  await closePool();
  process.exit(result.success ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
