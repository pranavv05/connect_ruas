/**
 * Script to test URL parsing for the roadmap API
 */

// Test URL parsing
const testUrls = [
  'http://localhost:3000/api/roadmaps?id=49a36c69-614a-4c82-a2ef-e648f1915476',
  'http://localhost:3000/api/roadmaps?limit=3',
  'http://localhost:3000/api/roadmaps',
  'http://localhost:3000/api/roadmaps?id=49a36c69-614a-4c82-a2ef-e648f1915476&limit=3'
];

testUrls.forEach(url => {
  const { searchParams } = new URL(url);
  const roadmapId = searchParams.get('id');
  const limit = searchParams.get('limit');
  
  console.log(`URL: ${url}`);
  console.log(`  roadmapId: ${roadmapId}`);
  console.log(`  limit: ${limit}`);
  console.log(`  Should fetch specific roadmap: ${!!roadmapId}`);
  console.log('');
});