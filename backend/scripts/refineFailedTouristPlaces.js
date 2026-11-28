import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { searchCandidates } from './curationCore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const touristPlacesDatasetPath = path.resolve(__dirname, '../src/services/images/verifiedTouristPlacesDataset.json');
  if (!fs.existsSync(touristPlacesDatasetPath)) {
    console.error('Dataset not found!');
    return;
  }

  const dataset = JSON.parse(fs.readFileSync(touristPlacesDatasetPath, 'utf8'));
  const placesRaw = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'all172Places.json'), 'utf8'));

  const usedPageIds = new Set();
  for (const item of Object.values(dataset.places)) {
    if (item.image && item.image.pageId) {
      usedPageIds.add(item.image.pageId);
    }
  }

  const missing = placesRaw.filter(p => !dataset.places[p.id]);
  console.log(`Missing places to refine: ${missing.length}`);

  let recovered = 0;
  for (const p of missing) {
    console.log(`Refining: ID ${p.id} - ${p.name} (${p.district_name}, ${p.state_name})...`);

    // Generate intelligent short queries
    const words = p.name.replace(/[&(),/]/g, ' ').split(/\s+/).filter(Boolean);
    const candidateQueries = [];

    // Query 1: First word + temple / fort / falls / river / forest / park if present
    const firstWord = words[0];
    const secondWord = words[1] || '';
    candidateQueries.push(`${firstWord} ${secondWord}`);
    candidateQueries.push(firstWord);

    // Query 2: Landmark name without parentheses
    const cleanName = p.name.replace(/\(.*?\)/g, '').replace(/&.*$/, '').trim();
    candidateQueries.push(cleanName);

    // Query 3: District name + state name
    candidateQueries.push(`${p.district_name} ${p.state_name}`);
    candidateQueries.push(`${p.district_name}`);

    let selected = null;
    for (const q of candidateQueries) {
      const candidates = await searchCandidates(q, 8);
      selected = candidates.find(c => !usedPageIds.has(c.pageId) && c.width >= 600);
      if (selected) break;
      await sleep(100);
    }

    if (selected) {
      usedPageIds.add(selected.pageId);
      dataset.places[p.id] = {
        id: p.id,
        name: p.name,
        district: p.district_name,
        state: p.state_name,
        category: p.category,
        image: selected
      };
      recovered++;
      console.log(`  ✓ RECOVERED ID ${p.id}: ${selected.title.substring(0, 40)}`);
    } else {
      console.error(`  ❌ STILL FAILED: ID ${p.id}`);
    }
    await sleep(150);
  }

  dataset.totalCurated = Object.keys(dataset.places).length;
  dataset.failedCount = placesRaw.length - dataset.totalCurated;
  dataset.curatedAt = new Date().toISOString();

  fs.writeFileSync(touristPlacesDatasetPath, JSON.stringify(dataset, null, 2));
  console.log(`\nRefinement Complete: Recovered ${recovered} places.`);
  console.log(`Total Curated in Dataset: ${dataset.totalCurated} / ${placesRaw.length}`);
}

main().catch(console.error);
