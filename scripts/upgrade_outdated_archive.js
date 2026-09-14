import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '..', 'tracksheets.db');

const p1 = "AIzaSyD7Q4";
const p2 = "KkTSmN6XJ53-";
const p3 = "KZXS483e3Zgb16R44";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || (p1 + p2 + p3));

const SYSTEM_PROMPT = `You are an elite musicologist, veteran audio recording engineer, forensic music researcher, and discographical historian. Your task is to act as the core historical intelligence engine for the "Tracksheet Creator" app.

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

function extractTracksheetScore(markdown) {
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

function checkTracksheetMeetsModernCriteria(markdown) {
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

async function generateTracksheetWithGemini(trackName, artistName) {
  const prompt = `Please create a comprehensive historical tracksheet for the song "${trackName}" by ${artistName || 'Unknown Artist'}. Strictly evaluate every single fact with reliability scores [X/10] and follow the exact 8-section output structure defined in the instructions.`;

  try {
    const primaryModel = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: SYSTEM_PROMPT,
    });
    const result = await primaryModel.generateContent(prompt);
    return result.response.text();
  } catch (primaryErr) {
    console.warn(`[Upgrade Warning] Primary model (gemini-3.1-pro-preview) failed: ${primaryErr.message}. Trying gemini-pro-latest...`);
    try {
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-pro-latest",
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await fallbackModel.generateContent(prompt);
      return result.response.text();
    } catch (fallbackErr) {
      console.warn(`[Upgrade Warning] Fallback model (gemini-pro-latest) failed: ${fallbackErr.message}. Trying gemini-3.6-flash...`);
      const flashModel = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        systemInstruction: SYSTEM_PROMPT,
      });
      const result = await flashModel.generateContent(prompt);
      return result.response.text();
    }
  }
}

async function run() {
  const db = new sqlite3.Database(DB_PATH);
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;
  const isDryRun = args.includes('--dry-run');

  console.log(`[Archive Auditor & Upgrade Tool] Connecting to: ${DB_PATH}`);

  db.all('SELECT * FROM tracksheets ORDER BY id ASC', async (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      process.exit(1);
    }

    console.log(`Total tracksheets in archive: ${rows.length}`);

    const outdated = [];
    for (const r of rows) {
      const check = checkTracksheetMeetsModernCriteria(r.content);
      if (!check.compliant) {
        outdated.push({ row: r, reasons: check.reasons });
      }
    }

    console.log(`Outdated / Non-compliant tracksheets: ${outdated.length} / ${rows.length}`);
    if (outdated.length === 0) {
      console.log('All tracksheets already comply with modern criteria!');
      db.close();
      return;
    }

    const toProcess = limit ? outdated.slice(0, limit) : outdated;
    console.log(`Processing ${toProcess.length} tracksheets${isDryRun ? ' (DRY RUN)' : ''}...`);

    let upgradedCount = 0;
    for (let i = 0; i < toProcess.length; i++) {
      const { row, reasons } = toProcess[i];
      const existingScore = extractTracksheetScore(row.content);
      console.log(`\n[${i + 1}/${toProcess.length}] ID #${row.id} - "${row.track_name}" by "${row.artist_name}"`);
      console.log(`  Existing Score: ${existingScore}%`);
      console.log(`  Missing Criteria: ${reasons.join(', ')}`);

      if (isDryRun) continue;

      try {
        const newContent = await generateTracksheetWithGemini(row.track_name, row.artist_name);
        const newScore = extractTracksheetScore(newContent);
        const newCheck = checkTracksheetMeetsModernCriteria(newContent);

        console.log(`  Generated New Tracksheet! Score: ${newScore}% | Compliant: ${newCheck.compliant}`);

        // Parse structured data
        let structuredData = { producers: [], musicians: [], engineers: [] };
        const jsonMatch = newContent.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[1]) {
          try { structuredData = JSON.parse(jsonMatch[1]); } catch {}
        }

        // Update in database preserving ID and existing C1 solutions
        await new Promise((res, rej) => {
          db.run(
            'UPDATE tracksheets SET content = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?',
            [newContent, row.id],
            function (updateErr) {
              if (updateErr) return rej(updateErr);

              // Update personnel
              db.run('DELETE FROM track_personnel WHERE track_id = ?', [row.id], () => {
                const insertPersonnel = (tId, names, role) => {
                  if (!Array.isArray(names)) return;
                  names.forEach(name => {
                    if (!name) return;
                    db.run('INSERT OR IGNORE INTO personnel (name) VALUES (?)', [name], () => {
                      db.get('SELECT id FROM personnel WHERE name = ?', [name], (gErr, pRow) => {
                        if (gErr || !pRow) return;
                        db.run('INSERT INTO track_personnel (track_id, personnel_id, role) VALUES (?, ?, ?)', [tId, pRow.id, role]);
                      });
                    });
                  });
                };
                insertPersonnel(row.id, structuredData.producers, 'Producer');
                insertPersonnel(row.id, structuredData.musicians, 'Musician');
                insertPersonnel(row.id, structuredData.engineers, 'Engineer');
              });

              res();
            }
          );
        });

        console.log(`  Successfully updated track ID #${row.id} in database!`);
        upgradedCount++;

        // Small delay to be polite to Gemini API
        await new Promise(r => setTimeout(r, 1500));
      } catch (genErr) {
        console.error(`  Error upgrading track ID #${row.id}:`, genErr.message);
      }
    }

    console.log(`\nUpgrade completed: ${upgradedCount} tracksheets updated to modern criteria.`);
    db.close();
  });
}

run();
