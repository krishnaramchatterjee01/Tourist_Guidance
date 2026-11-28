import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./backend/scratch/master_72_table.json', 'utf8'));
const lines = [];

for (const r of data.table) {
  const shortUrl = r.url.length > 55 ? r.url.slice(0, 52) + '...' : r.url;
  lines.push(`| ${String(r.num).padStart(2, '0')} | ${r.stateName} | ${r.role} | #${r.imageId} | **${r.scores.total}** | ${r.provider} | ${r.resolutionLabel} | HTTP ${r.live.status} (${r.live.format}, ${r.live.kb}KB) | \`${shortUrl}\` |`);
}

fs.writeFileSync('./backend/scratch/rendered_table.txt', lines.join('\n'), 'utf8');
console.log('Saved rendered table to backend/scratch/rendered_table.txt');
