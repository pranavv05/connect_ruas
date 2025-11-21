require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

// Get API key from environment
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

console.log('Testing Gemini API connection...');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey });

async function testConnection() {
  try {
    console.log('Sending test request to Gemini API...');
    
    // Simple test prompt
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { text: "Say 'Hello, World!' in 3 different languages." }
      ]
    });
    
    console.log('Response received:');
    console.log(response.text);
    console.log('✅ Gemini API connection successful!');
  } catch (error) {
    console.error('❌ Gemini API connection failed:');
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();