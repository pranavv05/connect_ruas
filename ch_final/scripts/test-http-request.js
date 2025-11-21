/**
 * Script to make an actual HTTP request to the roadmap API and see what response we get
 */

const https = require('https');
const http = require('http');

async function testHttpRequest() {
  // For local testing, use localhost
  const url = 'http://localhost:3000/api/roadmaps?id=49a36c69-614a-4c82-a2ef-e648f1915476';
  
  console.log(`Making HTTP request to: ${url}`);
  
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    
    lib.get(url, (res) => {
      let data = '';
      
      // Listen for data chunks
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // Listen for end of response
      res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
        console.log(`Response Body: ${data}`);
        
        try {
          const jsonData = JSON.parse(data);
          console.log(`Parsed JSON Response: ${JSON.stringify(jsonData, null, 2)}`);
        } catch (e) {
          console.log('Response is not valid JSON');
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.error('HTTP Request Error:', err);
      reject(err);
    });
  });
}

testHttpRequest().catch(console.error);