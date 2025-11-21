/**
 * Script to test the roadmap API directly
 */

// Load environment variables
require('dotenv').config();

async function testApi() {
  try {
    // Test the specific roadmap endpoint
    const roadmapId = '49a36c69-614a-4c82-a2ef-e648f1915476';
    const url = `http://localhost:3000/api/roadmaps?id=${roadmapId}`;
    
    console.log(`Testing API call to: ${url}`);
    
    // Since we can't easily make an authenticated request from Node.js,
    // let's just check what the URL parsing would produce
    const { URL } = require('url');
    const parsedUrl = new URL(url);
    const roadmapIdParam = parsedUrl.searchParams.get('id');
    const limitParam = parsedUrl.searchParams.get('limit');
    
    console.log('Parsed parameters:');
    console.log('  roadmapId:', roadmapIdParam);
    console.log('  limit:', limitParam);
    console.log('  Should call getRoadmapById:', !!roadmapIdParam);
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi();