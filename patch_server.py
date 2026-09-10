import re

with open('server.js', 'r') as f:
    content = f.read()

# Add import
content = content.replace("import { dirname, join } from 'path';", "import { dirname, join } from 'path';\nimport OpenAI from 'openai';")

# Replace the try block inside /api/tracksheets/generate
old_try_block_start = """  try {
    // In a real app, you would call an LLM API"""
old_try_block_end = """    // Wait 2 seconds to simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));"""

# Extract the portion from old_try_block_start up to old_try_block_end (inclusive)
pattern = re.compile(re.escape(old_try_block_start) + r".*?" + re.escape(old_try_block_end), re.DOTALL)

new_try_block = """  try {
    // Configure LM Studio connection
    const openai = new OpenAI({
      baseURL: 'http://localhost:1234/v1',
      apiKey: 'lm-studio', // required but ignored
    });

    const completion = await openai.chat.completions.create({
      model: 'local-model', // LM Studio usually ignores this and uses the loaded model
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Please create a tracksheet for the song "${track_name}" by ${artist_name || 'Unknown'}. Please make sure you return the exact markdown format specified in the system prompt.` }
      ],
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0].message.content;"""

content = pattern.sub(new_try_block, content)

# Change mockContent to generatedContent in the db.run call
content = content.replace("[track_name, artist_name, mockContent],", "[track_name, artist_name, generatedContent],")

with open('server.js', 'w') as f:
    f.write(content)

print("Patched server.js")
