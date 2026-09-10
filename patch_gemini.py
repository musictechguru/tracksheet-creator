import re

with open('server.js', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import OpenAI from 'openai';", "import { GoogleGenerativeAI } from '@google/generative-ai';\nimport 'dotenv/config';")

# Replace the try block inside /api/tracksheets/generate
old_try_block_start = """    // Configure LM Studio connection"""
old_try_block_end = """    const generatedContent = completion.choices[0].message.content;"""

# Extract the portion from old_try_block_start up to old_try_block_end (inclusive)
pattern = re.compile(re.escape(old_try_block_start) + r".*?" + re.escape(old_try_block_end), re.DOTALL)

new_try_block = """    // Configure Gemini connection
    if (!process.env.GEMINI_API_KEY) {
      console.warn("WARNING: GEMINI_API_KEY is not set in your environment.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-fallback-key');
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: SYSTEM_PROMPT,
    });

    const prompt = `Please create a tracksheet for the song "${track_name}" by ${artist_name || 'Unknown'}. Please make sure you return the exact markdown format specified in the system prompt.`;
    
    const result = await model.generateContent(prompt);
    const generatedContent = result.response.text();"""

content = pattern.sub(new_try_block, content)

# Fix the bug with mockContent
content = content.replace("content: mockContent", "content: generatedContent")

with open('server.js', 'w') as f:
    f.write(content)

print("Patched server.js for Gemini")
