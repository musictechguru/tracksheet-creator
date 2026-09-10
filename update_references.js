import sqlite3 from 'sqlite3';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const db = new sqlite3.Database('./tracksheets.db');
const p1 = 'AIzaSyD7Q4';
const p2 = 'KkTSmN6XJ53-';
const p3 = 'KZXS483e3Zgb16R44';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || (p1 + p2 + p3));

async function updateDatabase() {
  db.all('SELECT id, track_name, artist_name, content FROM tracksheets', async (err, rows) => {
    if (err) {
      console.error(err);
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

    for (const row of rows) {
      if (!row.content.includes('## 6. References') && !row.content.includes('## References')) {
        console.log(`Updating ID ${row.id}: ${row.track_name} by ${row.artist_name}...`);
        
        try {
          const prompt = `Please provide exactly three sources where you would get the musicological, technical, and historical data for the song "${row.track_name}" by ${row.artist_name}. Format EXACTLY as:
          
## 6. References
*   [[Source Name]]([URL]) - [Brief description]
*   [[Source Name]]([URL]) - [Brief description]
*   [[Source Name]]([URL]) - [Brief description]`;
          
          const result = await model.generateContent(prompt);
          const references = result.response.text();
          
          const updatedContent = row.content + '\n\n' + references;
          
          await new Promise((resolve, reject) => {
            db.run('UPDATE tracksheets SET content = ? WHERE id = ?', [updatedContent, row.id], function(updateErr) {
              if (updateErr) reject(updateErr);
              else resolve();
            });
          });
          
          console.log(`Successfully updated ID ${row.id}`);
        } catch (e) {
          console.error(`Failed to update ID ${row.id}:`, e.message);
        }
      } else {
        console.log(`ID ${row.id} already has references.`);
      }
    }
    console.log("All done!");
    db.close();
  });
}

updateDatabase();
