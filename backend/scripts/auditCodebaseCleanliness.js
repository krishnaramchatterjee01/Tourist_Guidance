import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

function getDirStats(dirPath) {
  let totalSize = 0;
  let fileCount = 0;
  let dirCount = 0;

  function walk(current) {
    if (!fs.existsSync(current)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        dirCount++;
        walk(full);
      } else if (ent.isFile()) {
        fileCount++;
        totalSize += fs.statSync(full).size;
      }
    }
  }

  walk(dirPath);
  return { totalSize, fileCount, dirCount };
}

function searchStringInDir(dir, searchPatterns, extensions = ['.js', '.jsx', '.json', '.html', '.css', '.mjs']) {
  const matches = [];

  function walk(current) {
    if (!fs.existsSync(current)) return;
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        if (ent.name !== 'node_modules' && ent.name !== '.git' && ent.name !== 'dist' && ent.name !== 'quarantine_local_images') {
          walk(full);
        }
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name);
        if (extensions.includes(ext)) {
          const content = fs.readFileSync(full, 'utf8');
          for (const pat of searchPatterns) {
            if (content.includes(pat)) {
              matches.push({ file: path.relative(rootDir, full), pattern: pat });
            }
          }
        }
      }
    }
  }

  walk(dir);
  return matches;
}

async function audit() {
  console.log('====================================================');
  console.log('EXPLORE INDIA — COMPREHENSIVE CODEBASE CLEANUP AUDIT');
  console.log('====================================================\n');

  // 1. Root-level file size and directory analysis
  const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
  console.log('--- 1. Root Directory Inventory ---');
  for (const ent of rootEntries) {
    if (ent.name === '.git') continue;
    const full = path.join(rootDir, ent.name);
    if (ent.isDirectory()) {
      const stats = getDirStats(full);
      console.log(`[DIR]  ${ent.name.padEnd(25)} : ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB (${stats.fileCount} files in ${stats.dirCount} dirs)`);
    } else {
      const stat = fs.statSync(full);
      console.log(`[FILE] ${ent.name.padEnd(25)} : ${(stat.size / 1024).toFixed(2)} KB`);
    }
  }

  // 2. Dependency check on root vanilla HTML/JS/CSS files
  console.log('\n--- 2. Root Vanilla HTML/JS/CSS Usage Audit ---');
  const vanillaFiles = [
    'coming-soon.html',
    'district.html',
    'explore.html',
    'index.vanilla.html',
    'states.html',
    'top-places.html',
    'west-bengal.html',
    'script.js',
    'districts.js',
    'style.css',
    'districts.css'
  ];

  for (const file of vanillaFiles) {
    const refs = searchStringInDir(path.join(rootDir, 'frontend'), [file]);
    const backendRefs = searchStringInDir(path.join(rootDir, 'backend/src'), [file]);
    console.log(`File [${file}]: ${refs.length} refs in frontend, ${backendRefs.length} refs in backend/src`);
  }

  // 3. Frontend src/data audit
  console.log('\n--- 3. Frontend src/data/ Usage Audit ---');
  const dataFiles = fs.readdirSync(path.join(rootDir, 'frontend/src/data'));
  for (const f of dataFiles) {
    const baseName = f.replace(/\.[^.]+$/, '');
    const refs = searchStringInDir(path.join(rootDir, 'frontend/src'), [`from '../data/${f}'`, `from './data/${f}'`, `from '../data/${baseName}'`, `from './data/${baseName}'`, `data/${baseName}`]);
    console.log(`frontend/src/data/${f}: ${refs.length} imports in frontend/src`);
  }

  // 4. Root src/ vs frontend/src/ audit
  console.log('\n--- 4. Root src/ vs frontend/src/ Comparison ---');
  const rootSrcStats = getDirStats(path.join(rootDir, 'src'));
  const frontendSrcStats = getDirStats(path.join(rootDir, 'frontend/src'));
  console.log(`Root src/        : ${(rootSrcStats.totalSize / 1024).toFixed(2)} KB (${rootSrcStats.fileCount} files)`);
  console.log(`Frontend src/    : ${(frontendSrcStats.totalSize / 1024).toFixed(2)} KB (${frontendSrcStats.fileCount} files)`);

  // Check if any build or script references root src/
  const rootSrcRefs = searchStringInDir(rootDir, ['/src/main.jsx', '"src/main.jsx"', 'from \'./src/']);
  console.log(`References to root src/ in project: ${rootSrcRefs.length}`);
  rootSrcRefs.forEach(r => console.log(`  - ${r.file}: ${r.pattern}`));

  // 5. Root public/ vs frontend/public/ audit
  console.log('\n--- 5. Root public/ vs frontend/public/ Comparison ---');
  const rootPubStats = getDirStats(path.join(rootDir, 'public'));
  const fePubStats = getDirStats(path.join(rootDir, 'frontend/public'));
  console.log(`Root public/     : ${(rootPubStats.totalSize / 1024).toFixed(2)} KB (${rootPubStats.fileCount} files)`);
  console.log(`Frontend public/ : ${(fePubStats.totalSize / 1024).toFixed(2)} KB (${fePubStats.fileCount} files)`);

  // 6. Root dist/ vs frontend/dist/ audit
  console.log('\n--- 6. Root dist/ vs frontend/dist/ Comparison ---');
  const rootDistStats = getDirStats(path.join(rootDir, 'dist'));
  const feDistStats = getDirStats(path.join(rootDir, 'frontend/dist'));
  console.log(`Root dist/       : ${(rootDistStats.totalSize / 1024 / 1024).toFixed(2)} MB (${rootDistStats.fileCount} files)`);
  console.log(`Frontend dist/   : ${(feDistStats.totalSize / 1024 / 1024).toFixed(2)} MB (${feDistStats.fileCount} files)`);

  // 7. NPM Dependencies Audit
  console.log('\n--- 7. NPM Dependencies Audit ---');
  const fePkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'frontend/package.json'), 'utf8'));
  console.log('Frontend Dependencies:');
  for (const dep of Object.keys(fePkg.dependencies || {})) {
    const refs = searchStringInDir(path.join(rootDir, 'frontend/src'), [`from '${dep}'`, `from "${dep}"`, `require('${dep}')`, `require("${dep}")`]);
    console.log(`  - ${dep.padEnd(20)}: ${refs.length} code references`);
  }
  for (const dep of Object.keys(fePkg.devDependencies || {})) {
    const refs = searchStringInDir(path.join(rootDir, 'frontend'), [dep]);
    console.log(`  - (dev) ${dep.padEnd(14)}: ${refs.length} references in frontend`);
  }

  const bePkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'backend/package.json'), 'utf8'));
  console.log('\nBackend Dependencies:');
  for (const dep of Object.keys(bePkg.dependencies || {})) {
    const refs = searchStringInDir(path.join(rootDir, 'backend/src'), [`from '${dep}'`, `from "${dep}"`, `require('${dep}')`, `require("${dep}")`]);
    console.log(`  - ${dep.padEnd(20)}: ${refs.length} code references`);
  }
  for (const dep of Object.keys(bePkg.devDependencies || {})) {
    const refs = searchStringInDir(path.join(rootDir, 'backend'), [dep]);
    console.log(`  - (dev) ${dep.padEnd(14)}: ${refs.length} references in backend`);
  }

  // 8. Quarantine local images audit
  console.log('\n--- 8. Quarantine Local Images Audit ---');
  const qStats = getDirStats(path.join(rootDir, 'quarantine_local_images'));
  console.log(`Quarantine Images: ${(qStats.totalSize / 1024 / 1024).toFixed(2)} MB (${qStats.fileCount} files in ${qStats.dirCount} dirs)`);

  // 9. Root node_modules and package-lock
  console.log('\n--- 9. Root node_modules & package-lock.json Audit ---');
  const rootNmStats = getDirStats(path.join(rootDir, 'node_modules'));
  console.log(`Root node_modules: ${(rootNmStats.totalSize / 1024).toFixed(2)} KB (${rootNmStats.fileCount} files)`);
}

audit().catch(console.error);
