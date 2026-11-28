import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const quarantineDir = path.resolve(rootDir, 'quarantine_local_images');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function moveJpgFiles(sourceDir, targetSubDir) {
  const targetDir = path.resolve(quarantineDir, targetSubDir);
  ensureDir(targetDir);

  let movedCount = 0;
  let preservedCount = 0;

  function walk(current) {
    if (!fs.existsSync(current)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const relative = path.relative(sourceDir, fullPath);

      if (entry.isDirectory()) {
        walk(fullPath);
        // If directory is now empty, remove it
        try {
          if (fs.readdirSync(fullPath).length === 0) {
            fs.rmdirSync(fullPath);
          }
        } catch (e) {}
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === '.svg' || entry.name === 'destination-placeholder.svg') {
          preservedCount++;
          console.log(`  🛡️ PRESERVED Functional Asset: ${relative}`);
        } else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
          const destPath = path.join(targetDir, relative);
          ensureDir(path.dirname(destPath));
          fs.renameSync(fullPath, destPath);
          movedCount++;
        }
      }
    }
  }

  walk(sourceDir);
  return { movedCount, preservedCount };
}

function main() {
  console.log('====================================================');
  console.log('CIMS PHASE 3: SAFE LOCAL IMAGE QUARANTINE & CLEANUP');
  console.log('====================================================\n');

  ensureDir(quarantineDir);

  // 1. Process frontend/public/images
  console.log('--- 1. Quarantining frontend/public/images ---');
  const frontendSource = path.resolve(rootDir, 'frontend/public/images');
  const frontendRes = moveJpgFiles(frontendSource, 'frontend_public_images');
  console.log(`  ✓ Moved ${frontendRes.movedCount} files to quarantine.`);
  console.log(`  ✓ Preserved ${frontendRes.preservedCount} functional assets in frontend/public/images.\n`);

  // 2. Process root public/images
  console.log('--- 2. Quarantining root public/images ---');
  const rootSource = path.resolve(rootDir, 'public/images');
  const rootRes = moveJpgFiles(rootSource, 'public_images');
  console.log(`  ✓ Moved ${rootRes.movedCount} files to quarantine.`);
  console.log(`  ✓ Preserved ${rootRes.preservedCount} functional assets in public/images.\n`);

  // 3. Verify clean state
  console.log('--- 3. Verifying Local Image Directories ---');
  function countFiles(dir) {
    if (!fs.existsSync(dir)) return { total: 0, jpg: 0, svg: 0 };
    let total = 0, jpg = 0, svg = 0;
    function walk(curr) {
      for (const ent of fs.readdirSync(curr, { withFileTypes: true })) {
        const fp = path.join(curr, ent.name);
        if (ent.isDirectory()) walk(fp);
        else if (ent.isFile()) {
          total++;
          if (ent.name.endsWith('.svg')) svg++;
          else if (ent.name.match(/\.(jpg|jpeg|png|webp)$/i)) jpg++;
        }
      }
    }
    walk(dir);
    return { total, jpg, svg };
  }

  const feCount = countFiles(frontendSource);
  const rtCount = countFiles(rootSource);

  console.log(`frontend/public/images: ${feCount.jpg} JPGs remaining, ${feCount.svg} SVGs preserved.`);
  console.log(`public/images: ${rtCount.jpg} JPGs remaining, ${rtCount.svg} SVGs preserved.`);

  if (feCount.jpg === 0 && rtCount.jpg === 0 && feCount.svg > 0) {
    console.log('\n🏆 SUCCESS: All legacy JPG files safely quarantined! Zero local tourism JPGs remaining.');
  } else {
    console.error('\n❌ FAILURE: Unexpected files remain in image directories.');
    process.exit(1);
  }
}

main();
