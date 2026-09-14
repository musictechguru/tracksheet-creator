import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
  generationConfig: { responseMimeType: 'application/json' }
});

const DECADES = [
  { id: '1950s', label: "1950's (1950–1959)", start: 1950, end: 1959 },
  { id: '1960s', label: "1960's (1960–1969)", start: 1960, end: 1969 },
  { id: '1970s', label: "1970's (1970–1979)", start: 1970, end: 1979 },
  { id: '1980s', label: "1980's (1980–1989)", start: 1980, end: 1989 },
  { id: '1990s', label: "1990's (1990–1999)", start: 1990, end: 1999 },
  { id: '2000s', label: "2000's (2000–2009)", start: 2000, end: 2009 },
  { id: '2010s', label: "2010's (2010–2019)", start: 2010, end: 2019 },
  { id: '2020s', label: "2020's (2020–Present)", start: 2020, end: 2026 }
];

async function fetchTop100ForDecade(decade) {
  console.log(`\nFetching top 100 songs for ${decade.id}...`);

  const batch1Prompt = `You are a music chart historian and archivist. Provide the definitive Top 50 songs of the ${decade.id} (${decade.start}-${decade.end}) ranked 1 to 50 based on historical Billboard Hot 100 / global chart impact, airplay, and sales.
Return a JSON array of 50 objects with fields:
- "rank": integer from 1 to 50
- "title": exact song title (string)
- "artist": primary artist / band name (string)
- "year": release year between ${decade.start} and ${decade.end} (integer)`;

  const batch2Prompt = `You are a music chart historian and archivist. Provide the definitive next 50 songs (ranks 51 to 100) of the ${decade.id} (${decade.start}-${decade.end}) based on historical Billboard Hot 100 / global chart impact, airplay, and sales. Do not repeat songs from ranks 1-50.
Return a JSON array of 50 objects with fields:
- "rank": integer from 51 to 100
- "title": exact song title (string)
- "artist": primary artist / band name (string)
- "year": release year between ${decade.start} and ${decade.end} (integer)`;

  const res1 = await model.generateContent(batch1Prompt);
  const part1 = JSON.parse(res1.response.text());

  const res2 = await model.generateContent(batch2Prompt);
  const part2 = JSON.parse(res2.response.text());

  const combined = [...part1, ...part2].map((item, idx) => ({
    rank: idx + 1,
    title: item.title.trim(),
    artist: item.artist.trim(),
    year: Number(item.year) || decade.start,
    decade: decade.id
  }));

  console.log(`✓ Retrieved ${combined.length} songs for ${decade.id}`);
  return combined;
}

async function main() {
  const result = {};

  for (const dec of DECADES) {
    try {
      const songs = await fetchTop100ForDecade(dec);
      result[dec.id] = {
        id: dec.id,
        label: dec.label,
        startYear: dec.start,
        endYear: dec.end,
        totalSongs: songs.length,
        songs
      };
    } catch (err) {
      console.error(`Error fetching ${dec.id}:`, err);
    }
  }

  const baseDir = '/Users/thorhouse/Tracksheet_creator';
  const jsonPath = path.resolve(baseDir, 'decade_songs.json');
  fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`\nSuccessfully wrote dataset to ${jsonPath}`);

  const jsPath = path.resolve(baseDir, 'src/data/decadeSongs.js');
  const jsContent = `// Auto-generated Decade Top 100 Songs Dataset (1950s - 2020s)\nexport const DECADE_SONGS = ${JSON.stringify(result, null, 2)};\n\nexport const DECADES_LIST = ${JSON.stringify(
    DECADES.map(d => ({ id: d.id, label: d.label, startYear: d.start, endYear: d.end })),
    null,
    2
  )};\n`;
  fs.writeFileSync(jsPath, jsContent, 'utf-8');
  console.log(`Successfully wrote JS module to ${jsPath}`);
}

main().catch(console.error);
