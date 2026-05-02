import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const dbPath = join(__dirname, 'tracksheets.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS tracksheets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        track_name TEXT NOT NULL,
        artist_name TEXT,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// Prompt Template
const SYSTEM_PROMPT = `You are an expert musicologist, audio engineer, and meticulous data researcher. Your task is to act as the core engine for a "Tracksheet Creator" app. When a user provides the name of a track (and ideally the artist), you will generate a highly detailed, accurate, and structured 'Tracksheet' containing comprehensive metadata, technical details, and musical analysis.

**Reliability Scoring**
For every requested element, provide a Reliability Score (1-10):
[10/10]: Verified primary sources.
[7-9/10]: Widely accepted consensus.
[4-6/10]: Educated deduction.
[1-3/10]: Speculation.
[0/10]: Data Unavailable.

**Output Format**
# TRACKSHEET: [Song Name] by [Artist Name]

## 1. General Metadata
*   **Song:** [Data] - Score: [X/10] (Source: [Note])
*   **Artist:** [Data] - Score: [X/10] (Source: [Note])
*   **Genre:** [Data] - Score: [X/10] (Source: [Note])
*   **Date Recorded:** [Data] - Score: [X/10] (Source: [Note])
*   **Original Record Company:** [Data] - Score: [X/10] (Source: [Note])
*   **YouTube Search:** [Generate a markdown link to search youtube for the song and artist: e.g. [Listen on YouTube](https://www.youtube.com/results?search_query=Song+Name+Artist+Name)]

## 2. Personnel
*   **Producer(s):** [Data] - Score: [X/10] (Source: [Note])
*   **Engineer(s):** [Data] - Score: [X/10] (Source: [Note])
*   **Musicians:** 
    *   [Name] - [Instrument] - Score: [X/10] (Source: [Note])

## 3. Location & Technical
*   **Studio Recorded:** [Data] - Score: [X/10] (Source: [Note])
*   **Studio Mixed:** [Data] - Score: [X/10] (Source: [Note])
*   **Equipment Used:** 
    *   [Equipment] - Score: [X/10] (Source: [Note])
*   **Instruments Used:** 
    *   [Instruments] - Score: [X/10] (Source: [Note])

## 4. Musical Analysis
*   **Musical Structure:** [Data] - Score: [X/10] (Source: [Note])
*   **Arrangement:** [Data] - Score: [X/10] (Source: [Note])

## 5. Signal Chains & Plugin Alternatives
*   **[Element Name]** - Reliability Score: [X/10] (Source)
    *   **Analog Signal Chain:** [Data]
    *   **3rd Party Plugin Equivalents:** [Data]
    *   **Stock DAW Approach:** [Data]`;

// API Endpoints

// Get all tracksheets
app.get('/api/tracksheets', (req, res) => {
  db.all('SELECT id, track_name, artist_name, created_at FROM tracksheets ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get a specific tracksheet
app.get('/api/tracksheets/:id', (req, res) => {
  db.get('SELECT * FROM tracksheets WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Tracksheet not found' });
    }
    res.json(row);
  });
});

// Generate a new tracksheet
app.post('/api/tracksheets/generate', async (req, res) => {
  const { track_name, artist_name } = req.body;
  if (!track_name) {
    return res.status(400).json({ error: 'track_name is required' });
  }

  try {
    // Configure Gemini connection
    if (!process.env.GEMINI_API_KEY) {
      console.warn("WARNING: GEMINI_API_KEY is not set in your environment.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAILuwIpgTSry08RyNrIkwg8YKyl6n27iM');
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-pro-preview",
      systemInstruction: SYSTEM_PROMPT,
    });

    const prompt = `Please create a tracksheet for the song "${track_name}" by ${artist_name || 'Unknown'}. Please make sure you return the exact markdown format specified in the system prompt.`;
    
    const result = await model.generateContent(prompt);
    let generatedContent = result.response.text();
    
    // Fallback: If the AI missed the YouTube link, append it to the end of the metadata or document
    if (!generatedContent.includes('youtube.com')) {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(track_name + ' ' + (artist_name || ''))}`;
      generatedContent = generatedContent.replace('## 2. Personnel', `*   **YouTube Search:** [Listen on YouTube](${searchUrl})\n\n## 2. Personnel`);
    }

    // Save to Database
    db.run(
      'INSERT INTO tracksheets (track_name, artist_name, content) VALUES (?, ?, ?)',
      [track_name, artist_name, generatedContent],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: this.lastID,
          track_name,
          artist_name,
          content: generatedContent
        });
      }
    );
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Serve Frontend in Production
app.use(express.static(join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
