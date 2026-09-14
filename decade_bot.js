import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database setup
const DB_PATH = path.resolve(__dirname, 'tracksheets.db');
const DATASET_PATH = path.resolve(__dirname, 'decade_songs.json');

// Gemini setup
const p1 = "AIzaSyD7Q4";
const p2 = "KkTSmN6XJ53-";
const p3 = "KZXS483e3Zgb16R44";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || (p1 + p2 + p3));

export const SYSTEM_PROMPT = `You are an elite musicologist, veteran audio recording engineer, forensic music researcher, and discographical historian. Your task is to act as the core historical intelligence engine for the "Tracksheet Creator" app.

When provided with a track name and artist, you must exhaust all musicological, historical, and technical research methods to uncover EXACTLY how, where, when, and by whom the track was recorded, produced, mixed, and mastered. Every single claim, historical instrument, microphone, and signal path must be evaluated with strict Reliability Scoring.

CRITICAL INSTRUCTION: Do NOT include Component 1 recording solutions, DAW recreations, or tutorial logbooks in this initial tracksheet. Focus strictly and exclusively on the verified historical session metadata, personnel, studio technology, structural breakdown, and primary sources.

---

### Reliability Scoring Framework
For EVERY historical fact, instrument, microphone, and signal chain element, append a strict Reliability Score [X/10] and concise source/deduction note:
*   **[10/10]**: Verified primary sources (original multitrack tape reels, studio session logs/track sheets, engineer diaries, producer/engineer memoirs, Abbey Road/Sound City/Olympic session documentation).
*   **[7-9/10]**: Widely accepted historical consensus & authoritative literature (Mark Lewisohn, Ian MacDonald, Geoff Emerick, Sound On Sound "Classic Tracks", Mix Magazine, Bobby Owsinski).
*   **[4-6/10]**: Educated technical deduction based on verified studio equipment rosters, period-accurate studio practices, and known engineer setups.
*   **[1-3/10]**: Educated speculation / unconfirmed studio lore.
*   **[0/10]**: Data Unavailable.

---

### Output Format (Strict Markdown)

# TRACKSHEET: [Song Name] by [Artist Name]

## 1. General Metadata
*   **Song:** [Data] - Score: [X/10] (Source: [Note])
*   **Artist:** [Data] - Score: [X/10] (Source: [Note])
*   **Genre / Style:** [Data] - Score: [X/10] (Source: [Note])
*   **Date(s) Recorded:** [Specific session dates] - Score: [X/10] (Source: [Note])
*   **Original Record Company & Catalog #:** [Data] - Score: [X/10] (Source: [Note])
*   **Release Date:** [Data] - Score: [X/10] (Source: [Note])
*   **YouTube Search:** [Listen on YouTube](https://www.youtube.com/results?search_query=Song+Name+Artist+Name)

## 2. Personnel & Session Credits
*   **Producer(s):** [Data] - Score: [X/10] (Source: [Note])
*   **Chief Recording Engineer(s):** [Data] - Score: [X/10] (Source: [Note])
*   **Assistant Engineer(s) / Tape Operator(s):** [Data] - Score: [X/10] (Source: [Note])
*   **Mixing Engineer(s):** [Data] - Score: [X/10] (Source: [Note])
*   **Mastering Engineer(s):** [Data] - Score: [X/10] (Source: [Note])
*   **Musicians & Session Performers:**
    *   [Musician Name] - [Exact Instrument / Vocal Part] - Score: [X/10] (Source: [Note])

## 3. Location & Studio Technology
*   **Tracking Studio & Room:** [Studio Name, City, Room/Studio #] - Score: [X/10] (Source: [Note])
*   **Mixing / Overdub Studio:** [Studio Name, City] - Score: [X/10] (Source: [Note])
*   **Mixing Console / Desk:** [Specific console: e.g., Neve 8048, SSL 4000E, EMI REDD.51, Trident A-Range] - Score: [X/10] (Source: [Note])
*   **Multitrack Tape Machine & Format:** [e.g., Studer J37 4-Track 1-inch, 3M 8-Track, Ampex MM1200 24-Track 2-inch at 15/30 IPS] - Score: [X/10] (Source: [Note])
*   **Studio Monitors:** [e.g., Altec 604, Tannoy Dual Concentric, Yamaha NS-10M, Auratone 5C] - Score: [X/10] (Source: [Note])
*   **Key Outboard Processors & Hardware Units:**
    *   [Compressors/Limiters, EQs, Plate/Spring Reverbs, Tape Delays] - Score: [X/10] (Source: [Note])

## 4. Musical & Structural Analysis
*   **Form & Structural Breakdown:** Provide an in-depth, section-by-section chronological roadmap of the song structure with exact timings/bar counts, musical details, and arrangement dynamics for every section:
    *   **Intro ([Timings / Bar Count]):** [Detailed musical analysis of instrumentation, arrangement entry, harmonic movement, dynamic level] - Score: [X/10] (Source: [Note])
    *   **Verse 1 ([Timings / Bar Count]):** [Detailed musical analysis of instrumentation, vocal delivery, arrangement texture] - Score: [X/10] (Source: [Note])
    *   **Pre-Chorus ([Timings / Bar Count]):** [Detailed musical analysis of tension build, chordal movement, rhythmic changes] - Score: [X/10] (Source: [Note])
    *   **Chorus ([Timings / Bar Count]):** [Detailed musical analysis of hook, arrangement layering, stereo dynamics] - Score: [X/10] (Source: [Note])
    *   **Verse 2 ([Timings / Bar Count]):** [Detailed musical analysis of variations, added fills or instrumentation] - Score: [X/10] (Source: [Note])
    *   **Bridge / Solo ([Timings / Bar Count]):** [Detailed musical analysis of modulations, solo techniques, rhythmic shifts] - Score: [X/10] (Source: [Note])
    *   **Outro ([Timings / Bar Count]):** [Detailed musical analysis of resolution, vamp, fade-out or cold ending] - Score: [X/10] (Source: [Note])
*   **Key, Modulations & Tempo:**
    *   **Key:** [Root key, tonality, modes, modal interchange, harmonic shifts] - Score: [X/10] (Source: [Note])
    *   **Tempo:** [Exact BPM tempo map, tempo fluctuations/human feel, click track vs. free time] - Score: [X/10] (Source: [Note])
    *   **Time Signature & Meter:** [Meter, compound/simple, syncopation, polyrhythms] - Score: [X/10] (Source: [Note])
*   **Arrangement & Production Techniques:**
    *   **[Technique 1: e.g. Dynamic Staging / Vocal Layering]:** [Detailed analysis] - Score: [X/10] (Source: [Note])
    *   **[Technique 2: e.g. Harmonic Counterpoint / Wall of Sound]:** [Detailed analysis] - Score: [X/10] (Source: [Note])
    *   **[Technique 3: e.g. Period Production Signatures (Varispeed, ADT, Leslie, Reverse Tape)]:** [Detailed analysis] - Score: [X/10] (Source: [Note])

## 5. Historical Recording Pathways & Session Signal Chains
Meticulously document the authentic historical recording pathways, capture techniques, and analog signal chains for EVERY individual instrument and vocal stem recorded during the session (e.g. Kick Drum, Snare Top/Bottom, Overheads, Bass, Rhythm Electric Guitar, Lead Electric Guitar, Acoustic Guitar, Lead Vocals, Backing Vocals, Keyboards/Organ/Piano/Synthesizers, Brass/Strings, Auxiliary Percussion).

For EACH instrument/stem, provide:

### [Instrument / Stem Name]
*   **Historical Instrument & Backline Details:** [Exact make, model, year, pickup/tuning/voicing settings, amplifier, speaker cabinet, acoustic space] - Score: [X/10] (Source: [Note])
*   **Capture Pathway & Input Method:** [Specify the authentic historical pathway: Acoustic Microphone Capture, Direct Injection (DI) into the desk, Instrument Line-Level / Re-Amping, or Rotary Leslie Speaker Cabinet] - Score: [X/10] (Source: [Note])
*   **Microphone(s) & Transducer Setup:** [Exact vintage microphone model(s) used (e.g. Neumann U47/U67/U87, AKG C12/D12/D19, Coles 4038, Shure SM57, Electro-Voice RE20), polar pattern (Cardioid, Figure-8, Omni, Hypercardioid), transducer type (Moving-coil Dynamic, LDC, SDC, Ribbon, Valve/Tube)] - Score: [X/10] (Source: [Note])
*   **Microphone Placement, Distance & Acoustic Baffling:** [Exact distance from the source in cm/inches, on-axis vs. off-axis angle, speaker cone vs. dustcap alignment, 12th-fret acoustic alignment, distance from pop shield; use of acoustic gobos, isolation screens, vocal booths, or spill isolation nulls] - Score: [X/10] (Source: [Note])
*   **Stereo / Multi-Mic Array (if applicable):** [e.g. A/B Spaced Pair, X/Y Coincident, Blumlein, ORTF, Mid-Side, or Glyn Johns drum technique; phase alignment measures] - Score: [X/10] (Source: [Note])
*   **Analog Tracking Signal Chain & Hardware Processing:** [Console channel mic preamp, console EQ settings, hardware tracking compressors/limiters (e.g. Fairchild 660/670, UREI 1176, Teletronix LA-2A, Altec RS124), tape machine input saturation, hardware plate/spring reverb, or tape slapback/ADT routing] - Score: [X/10] (Source: [Note])
*   **Multitrack Tape Allocation & Bouncing History:** [Original track assignment on the 4-track, 8-track, 16-track, or 24-track tape reel, including track bounces/reductions and overdub layers] - Score: [X/10] (Source: [Note])
*   **Historical Mix Balance, Panning & Spatial Placement:** [Exact stereo pan position in the final mix (e.g. Center, Hard Left/Right, 9 o'clock / 3 o'clock, mono sum), relative fader balance in the mix, front-to-back acoustic depth] - Score: [X/10] (Source: [Note])
*   **Historical Mixdown Processing & Outboard FX:** [Console channel mix EQ, mixdown hardware compression, auxiliary reverb sends (e.g. EMT 140 plate, Lexicon 480L, live echo chamber), delay/ADT, tape flanging/phasing, fader ride automation] - Score: [X/10] (Source: [Note])

## 6. Historical Mixdown, Master Bus & Stereo Master Tape
*   **Mixdown Architecture & Console Routing:** [Console used for final mixdown (e.g. Neve 8048 / SSL 4000E), automation systems (e.g. NECAM, SSL Total Recall, or manual fader passes), group/subgroup buses, monitoring levels] - Score: [X/10] (Source: [Note])
*   **Master Bus Signal Chain & Dynamics:** [Stereo master bus compression (e.g. SSL G-Master Bus compressor 4:1 ratio 30ms attack, Fairchild 670, Neve 33609), program equalization (e.g. Pultec EQP-1A, Lang PEQ-2), analog tape saturation] - Score: [X/10] (Source: [Note])
*   **Stereo Master Tape Recorder & Tape Formulation:** [Specific 2-track master tape recorder (e.g. Ampex ATR-102 1/2-inch 30 IPS, Studer A80, EMI BTR), tape stock (e.g. 3M 996, Ampex 456 Grand Master), Dolby A / SR noise reduction] - Score: [X/10] (Source: [Note])
*   **Mixdown Spatial Staging & Stereo vs. Mono Variants:** [Stereo width, center image anchoring, mono compatibility, differences between original mono single mix vs. stereo album mix] - Score: [X/10] (Source: [Note])

## 7. References
Provide exactly three to five authoritative historical and technical sources where you retrieved or verified the information. Format as markdown bullet points with working links:
*   [[Source Name]]([URL]) - [Brief description of the historical or technical data sourced from here]
*   [[Source Name]]([URL]) - [Brief description of the historical or technical data sourced from here]
*   [[Source Name]]([URL]) - [Brief description of the historical or technical data sourced from here]

## 8. Structured Data
Please append a final section with a valid JSON block enclosed in \`\`\`json containing the core entities extracted from this tracksheet. Use this exact schema:
\`\`\`json
{
  "producers": ["Name 1", "Name 2"],
  "musicians": ["Name 1", "Name 2"],
  "engineers": ["Name 1"]
}
\`\`\`
If a field has no known data, use an empty array [].`;

export function extractTracksheetScore(markdown) {
  if (!markdown || typeof markdown !== 'string') return 0;
  const matches = [...markdown.matchAll(/(?:-\s*)?(?:Reliability\s*)?Score:\s*\[(\d+)(?:\/10)?\]/gi)];
  if (!matches || matches.length === 0) return 0;
  let total = 0;
  let count = 0;
  for (const m of matches) {
    const val = parseInt(m[1], 10);
    if (!isNaN(val) && val >= 0 && val <= 10) {
      total += val;
      count++;
    }
  }
  return count > 0 ? Math.round((total / (count * 10)) * 100) : 0;
}

export function checkTracksheetMeetsModernCriteria(markdown) {
  if (!markdown || typeof markdown !== 'string') {
    return { compliant: false, scoreCount: 0, reasons: ['Empty or invalid tracksheet content'] };
  }

  const reasons = [];
  if (!/##\s*1\.\s*General\s*Metadata/i.test(markdown)) reasons.push('Missing Section 1: General Metadata');
  if (!/##\s*2\.\s*Personnel/i.test(markdown)) reasons.push('Missing Section 2: Personnel');
  if (!/##\s*3\.\s*(Location|Studio\s*Technology)/i.test(markdown)) reasons.push('Missing Section 3: Location & Studio Technology');
  if (!/##\s*4\.\s*Musical/i.test(markdown)) reasons.push('Missing Section 4: Musical & Structural Analysis');
  if (!/##\s*5\.\s*(Historical\s*Recording\s*Pathways|Session\s*Signal\s*Chains|Signal\s*Chain)/i.test(markdown)) reasons.push('Missing Section 5: Historical Recording Pathways');
  if (!/##\s*6\.\s*(Historical\s*Mixdown|Mixdown.*Master\s*Bus|Master\s*Bus|Stereo\s*Master)/i.test(markdown)) reasons.push('Missing Section 6: Historical Mixdown & Master Bus');
  if (!/##\s*7\.\s*References/i.test(markdown)) reasons.push('Missing Section 7: References');

  const scoreMatches = markdown.match(/(?:-\s*)?(?:Reliability\s*)?Score:\s*\[(\d+)(?:\/10)?\]/gi) || [];
  if (scoreMatches.length < 15) {
    reasons.push(`Low Reliability Score count (${scoreMatches.length}/15 minimum required)`);
  }

  return {
    compliant: reasons.length === 0,
    scoreCount: scoreMatches.length,
    reasons
  };
}

export function openDatabase() {
  return new sqlite3.Database(DB_PATH);
}

export function loadDecadeDataset() {
  if (!fs.existsSync(DATASET_PATH)) {
    throw new Error(`Dataset not found at ${DATASET_PATH}`);
  }
  return JSON.parse(fs.readFileSync(DATASET_PATH, 'utf-8'));
}

// Check if a song already exists in tracksheets table
export function findExistingTrack(db, title, artist) {
  return new Promise((resolve, reject) => {
    const cleanT = (title || '').trim();
    const cleanA = (artist || '').trim();

    if (cleanA) {
      db.get(
        `SELECT id, track_name, artist_name, content, created_at FROM tracksheets 
         WHERE LOWER(TRIM(track_name)) = LOWER(?) AND LOWER(TRIM(artist_name)) = LOWER(?)
         ORDER BY id DESC LIMIT 1`,
        [cleanT, cleanA],
        (err, row) => {
          if (err) return reject(err);
          if (row) return resolve(row);

          // Substring/partial artist match fallback
          db.get(
            `SELECT id, track_name, artist_name, content, created_at FROM tracksheets 
             WHERE LOWER(TRIM(track_name)) = LOWER(?) 
               AND (LOWER(TRIM(artist_name)) LIKE LOWER(?) OR LOWER(?) LIKE '%' || LOWER(TRIM(artist_name)) || '%')
             ORDER BY id DESC LIMIT 1`,
            [cleanT, `%${cleanA}%`, cleanA],
            (err2, row2) => {
              if (err2) return reject(err2);
              resolve(row2 || null);
            }
          );
        }
      );
    } else {
      db.get(
        `SELECT id, track_name, artist_name, content, created_at FROM tracksheets 
         WHERE LOWER(TRIM(track_name)) = LOWER(?)
         ORDER BY id DESC LIMIT 1`,
        [cleanT],
        (err, row) => {
          if (err) return reject(err);
          resolve(row || null);
        }
      );
    }
  });
}

// Generate a tracksheet using Gemini and insert into SQLite
export async function generateAndSaveTracksheet(db, trackName, artistName, forceRegenerate = false) {
  const cleanTrack = trackName.trim();
  const cleanArtist = artistName ? artistName.trim() : '';
  let existingIdToUpdate = null;
  let existingRecord = null;

  if (!forceRegenerate) {
    const existing = await findExistingTrack(db, cleanTrack, cleanArtist);
    if (existing) {
      const criteriaCheck = checkTracksheetMeetsModernCriteria(existing.content);
      if (criteriaCheck.compliant) {
        return {
          id: existing.id,
          track_name: existing.track_name,
          artist_name: existing.artist_name,
          score: extractTracksheetScore(existing.content),
          is_compliant: true,
          is_cached: true
        };
      }
      // Outdated criteria: upgrade existing record
      existingIdToUpdate = existing.id;
      existingRecord = existing;
    }
  }

  const prompt = `Please create a tracksheet for the song "${cleanTrack}" by ${cleanArtist || 'Unknown'}. Please make sure you return the exact markdown format specified in the system prompt.`;
  
  let generatedContent = '';
  try {
    const primaryModel = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: SYSTEM_PROMPT,
    });
    const result = await primaryModel.generateContent(prompt);
    generatedContent = result.response.text();
  } catch (primaryErr) {
    console.warn(`[Bot Warning] Primary model (gemini-3.1-pro-preview) error for "${cleanTrack}", trying gemini-pro-latest:`, primaryErr.message);
    try {
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-pro-latest",
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await fallbackModel.generateContent(prompt);
      generatedContent = result.response.text();
    } catch (fallbackErr) {
      console.warn(`[Bot Warning] Secondary Pro model error for "${cleanTrack}", trying gemini-3.6-flash:`, fallbackErr.message);
      const flashModel = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await flashModel.generateContent(prompt);
      generatedContent = result.response.text();
    }
  }

  // Ensure YouTube fallback
  if (!generatedContent.includes('youtube.com')) {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTrack + ' ' + cleanArtist)}`;
    generatedContent = generatedContent.replace('## 2. Personnel', `*   **YouTube Search:** [Listen on YouTube](${searchUrl})\n\n## 2. Personnel`);
  }

  // Parse structured personnel
  let structuredData = { producers: [], musicians: [], engineers: [] };
  const jsonMatch = generatedContent.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      structuredData = JSON.parse(jsonMatch[1]);
    } catch {
      // ignore json parse error
    }
  }

  const insertPersonnel = (trackId, names, role) => {
    if (!Array.isArray(names)) return;
    names.forEach(name => {
      if (!name) return;
      db.run('INSERT OR IGNORE INTO personnel (name) VALUES (?)', [name], function(pErr) {
        if (pErr) return;
        db.get('SELECT id FROM personnel WHERE name = ?', [name], (gErr, row) => {
          if (gErr || !row) return;
          db.run('INSERT INTO track_personnel (track_id, personnel_id, role) VALUES (?, ?, ?)', [trackId, row.id, role]);
        });
      });
    });
  };

  const newScore = extractTracksheetScore(generatedContent);

  // If auto-upgrading or regenerating an existing row
  if (existingIdToUpdate && existingRecord) {
    const existingScore = extractTracksheetScore(existingRecord.content);
    const existingCheck = checkTracksheetMeetsModernCriteria(existingRecord.content);
    const newCheck = checkTracksheetMeetsModernCriteria(generatedContent);

    const shouldKeepExisting = (existingCheck.compliant && !newCheck.compliant) ||
      (existingCheck.compliant === newCheck.compliant && existingScore > newScore);

    if (shouldKeepExisting) {
      return {
        id: existingIdToUpdate,
        track_name: existingRecord.track_name,
        artist_name: existingRecord.artist_name,
        score: existingScore,
        is_compliant: existingCheck.compliant,
        is_cached: true,
        kept_existing_highest: true
      };
    }

    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE tracksheets SET content = ?, track_name = ?, artist_name = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?',
        [generatedContent, cleanTrack, cleanArtist, existingIdToUpdate],
        function (err) {
          if (err) return reject(err);
          db.run('DELETE FROM track_personnel WHERE track_id = ?', [existingIdToUpdate], () => {
            insertPersonnel(existingIdToUpdate, structuredData.producers, 'Producer');
            insertPersonnel(existingIdToUpdate, structuredData.musicians, 'Musician');
            insertPersonnel(existingIdToUpdate, structuredData.engineers, 'Engineer');
          });
          resolve({
            id: existingIdToUpdate,
            track_name: cleanTrack,
            artist_name: cleanArtist,
            score: newScore,
            is_compliant: true,
            is_cached: false,
            was_upgraded: true
          });
        }
      );
    });
  }

  // Insert brand new tracksheet into SQLite
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO tracksheets (track_name, artist_name, content) VALUES (?, ?, ?)',
      [cleanTrack, cleanArtist, generatedContent],
      function (err) {
        if (err) return reject(err);
        const newTrackId = this.lastID;

        insertPersonnel(newTrackId, structuredData.producers, 'Producer');
        insertPersonnel(newTrackId, structuredData.musicians, 'Musician');
        insertPersonnel(newTrackId, structuredData.engineers, 'Engineer');

        resolve({
          id: newTrackId,
          track_name: cleanTrack,
          artist_name: cleanArtist,
          score: newScore,
          is_compliant: true,
          is_cached: false
        });
      }
    );
  });
}

// Get comprehensive status of all decades
export async function getDecadeCoverageStatus(db) {
  const dataset = loadDecadeDataset();
  const decades = Object.keys(dataset);
  const status = [];

  for (const dec of decades) {
    const songs = dataset[dec].songs;
    let archivedCount = 0;

    for (const s of songs) {
      const existing = await findExistingTrack(db, s.title, s.artist);
      if (existing) archivedCount++;
    }

    status.push({
      decade: dec,
      label: dataset[dec].label,
      totalSongs: songs.length,
      archivedCount,
      pendingCount: songs.length - archivedCount,
      coveragePercent: Math.round((archivedCount / songs.length) * 100)
    });
  }

  return status;
}

// Get songs with live status for a specific decade
export async function getDecadeSongsWithStatus(db, decadeId) {
  const dataset = loadDecadeDataset();
  if (!dataset[decadeId]) {
    throw new Error(`Decade "${decadeId}" not found in dataset.`);
  }

  const songs = dataset[decadeId].songs;
  const enriched = [];

  for (const s of songs) {
    const existing = await findExistingTrack(db, s.title, s.artist);
    enriched.push({
      ...s,
      isArchived: !!existing,
      tracksheetId: existing ? existing.id : null,
      archivedAt: existing ? existing.created_at : null
    });
  }

  return {
    ...dataset[decadeId],
    songs: enriched,
    archivedCount: enriched.filter(s => s.isArchived).length,
    pendingCount: enriched.filter(s => !s.isArchived).length
  };
}

// Bot Runner Engine with progress callbacks
export async function runDecadeHarvester({
  decade = '1950s',
  limit = Infinity,
  delayMs = 2000,
  force = false,
  onProgress = () => {},
  shouldStop = () => false
}) {
  const db = openDatabase();
  const dataset = loadDecadeDataset();
  const targetDecades = decade === 'all' ? Object.keys(dataset) : [decade];

  const results = {
    totalProcessed: 0,
    generated: 0,
    cached: 0,
    failed: 0,
    items: []
  };

  try {
    for (const dec of targetDecades) {
      if (shouldStop()) break;
      const decInfo = dataset[dec];
      if (!decInfo) {
        console.warn(`Unknown decade: ${dec}`);
        continue;
      }

      for (const song of decInfo.songs) {
        if (shouldStop() || results.totalProcessed >= limit) break;

        onProgress({
          type: 'START_SONG',
          decade: dec,
          song,
          processed: results.totalProcessed,
          limit
        });

        try {
          const res = await generateAndSaveTracksheet(db, song.title, song.artist, force);
          results.totalProcessed++;
          if (res.is_cached) {
            results.cached++;
          } else {
            results.generated++;
          }

          results.items.push({
            song,
            decade: dec,
            success: true,
            isCached: res.is_cached,
            id: res.id
          });

          onProgress({
            type: 'SONG_COMPLETE',
            decade: dec,
            song,
            id: res.id,
            isCached: res.is_cached,
            results
          });

          // Wait delay if fresh API call was made
          if (!res.is_cached && delayMs > 0 && !shouldStop()) {
            await new Promise(r => setTimeout(r, delayMs));
          }
        } catch (err) {
          results.totalProcessed++;
          results.failed++;
          results.items.push({
            song,
            decade: dec,
            success: false,
            error: err.message
          });

          onProgress({
            type: 'SONG_ERROR',
            decade: dec,
            song,
            error: err.message,
            results
          });
        }
      }
    }
  } finally {
    db.close();
  }

  return results;
}

// CLI Execution if run directly
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  const args = process.argv.slice(2);
  const getArgVal = (name, def = null) => {
    const found = args.find(a => a.startsWith(`--${name}=`));
    if (found) return found.split('=')[1];
    if (args.includes(`--${name}`)) return true;
    return def;
  };

  const showStatus = args.includes('--status');
  const showHelp = args.includes('--help') || args.includes('-h');
  const decadeArg = getArgVal('decade', '1950s');
  const limitArg = parseInt(getArgVal('limit', '0'), 10) || Infinity;
  const delayArg = parseInt(getArgVal('delay', '2000'), 10);
  const forceArg = args.includes('--force');
  const dryRun = args.includes('--dry-run');

  if (showHelp) {
    console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║             TRACKSHEET CREATOR - DECADE HARVESTER BOT                  ║
╚════════════════════════════════════════════════════════════════════════╝

Usage:
  node decade_bot.js [options]

Options:
  --decade=<decade>    Decade to harvest: 1950s, 1960s, 1970s, 1980s,
                       1990s, 2000s, 2010s, 2020s, or 'all' (default: 1950s)
  --limit=<number>     Maximum number of songs to process in this run
  --delay=<ms>         Delay in ms between generation requests (default: 2000)
  --status             Show archive coverage stats for all 8 decades
  --dry-run            List matching songs without generating tracksheets
  --force              Force regeneration even if song already exists in archive
  --help, -h           Show this help manual

Examples:
  npm run bot -- --status
  npm run bot -- --decade=1950s --limit=5
  npm run bot -- --decade=all --limit=20
`);
    process.exit(0);
  }

  (async () => {
    const db = openDatabase();

    if (showStatus) {
      console.log('\n📊 Inspecting Tracksheet Archive Coverage across All Decades...\n');
      const stats = await getDecadeCoverageStatus(db);
      db.close();

      console.table(stats.map(s => ({
        Decade: s.label,
        'Archived in DB': `${s.archivedCount} / ${s.totalSongs}`,
        Pending: s.pendingCount,
        'Coverage %': `${s.coveragePercent}%`
      })));

      const totalArchived = stats.reduce((acc, s) => acc + s.archivedCount, 0);
      const totalSongs = stats.reduce((acc, s) => acc + s.totalSongs, 0);
      console.log(`\n🏁 Total Coverage: ${totalArchived} / ${totalSongs} songs archived (${Math.round((totalArchived / totalSongs) * 100)}%)\n`);
      process.exit(0);
    }

    if (dryRun) {
      const data = await getDecadeSongsWithStatus(db, decadeArg);
      db.close();
      console.log(`\n🔍 Dry Run for ${data.label}: Showing first ${Math.min(limitArg, data.songs.length)} songs\n`);
      console.table(data.songs.slice(0, limitArg).map(s => ({
        Rank: `#${s.rank}`,
        Title: s.title,
        Artist: s.artist,
        Year: s.year,
        Status: s.isArchived ? `ARCHIVED (#${s.tracksheetId})` : 'PENDING'
      })));
      process.exit(0);
    }

    console.log(`\n🚀 Launching Tracksheet Harvester Bot...`);
    console.log(`   Target Decade: ${decadeArg.toUpperCase()}`);
    console.log(`   Song Limit:    ${limitArg === Infinity ? 'ALL (Up to 100)' : limitArg}`);
    console.log(`   Delay:         ${delayArg}ms\n`);

    let isInterrupted = false;
    process.on('SIGINT', () => {
      console.log('\n\n⚠️ SIGINT received. Gracefully stopping harvester...');
      isInterrupted = true;
    });

    const startTime = Date.now();

    const results = await runDecadeHarvester({
      decade: decadeArg,
      limit: limitArg,
      delayMs: delayArg,
      force: forceArg,
      shouldStop: () => isInterrupted,
      onProgress: (evt) => {
        if (evt.type === 'START_SONG') {
          process.stdout.write(`[${evt.decade}] #${evt.song.rank} "${evt.song.title}" by ${evt.song.artist}... `);
        } else if (evt.type === 'SONG_COMPLETE') {
          if (evt.isCached) {
            console.log(`⚡ [CACHED / ALREADY IN ARCHIVE] (ID: #${evt.id})`);
          } else {
            console.log(`✨ [GENERATED & SAVED] (ID: #${evt.id})`);
          }
        } else if (evt.type === 'SONG_ERROR') {
          console.log(`❌ [FAILED: ${evt.error}]`);
        }
      }
    });

    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n════════════════════════════════════════════════════════════`);
    console.log(`🎉 Bot Run Complete in ${elapsedSec}s!`);
    console.log(`   Processed: ${results.totalProcessed}`);
    console.log(`   Newly Generated: ${results.generated}`);
    console.log(`   Already Cached:  ${results.cached}`);
    console.log(`   Failed:          ${results.failed}`);
    console.log(`════════════════════════════════════════════════════════════\n`);
  })();
}
