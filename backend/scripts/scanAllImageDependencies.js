import fs from 'fs';
import path from 'path';

const findings = {
  cssUrlMatches: [],
  jsxMatches: [],
  databaseLocalPaths: [],
  localFiles: [],
  jsonDatasetMatches: []
};

// 1. Scan frontend code & CSS
function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else {
      const relPath = fullPath.replace(/\\/g, '/');
      const ext = path.extname(file).toLowerCase();
      
      // If image file
      if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.ico', '.avif'].includes(ext)) {
        findings.localFiles.push({
          path: relPath,
          size: stat.size,
          ext,
          name: file
        });
      }

      // If code/style file
      if (/\.(css|scss|jsx?|tsx?|html)$/.test(file)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('/images/') || line.includes('url(') && line.includes('image')) {
            if (/\.(css|scss)$/.test(file)) {
              findings.cssUrlMatches.push({ file: relPath, line: idx + 1, text: line.trim() });
            } else {
              findings.jsxMatches.push({ file: relPath, line: idx + 1, text: line.trim() });
            }
          }
        });
      }
    }
  }
}

scanDir('frontend');
scanDir('public');

console.log('Total local image files:', findings.localFiles.length);
console.log('CSS /images/ matches:', findings.cssUrlMatches.length);
console.log('JSX /images/ matches:', findings.jsxMatches.length);

console.log('\n--- CSS Matches ---');
findings.cssUrlMatches.forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.text}`));

console.log('\n--- Sample JSX Matches (first 10) ---');
findings.jsxMatches.slice(0, 10).forEach(m => console.log(`  ${m.file}:${m.line} -> ${m.text}`));

fs.writeFileSync('docs/CIMS_PHASE_3_SCAN_RESULTS.json', JSON.stringify(findings, null, 2), 'utf8');
console.log('\n✓ Saved full findings to docs/CIMS_PHASE_3_SCAN_RESULTS.json');
