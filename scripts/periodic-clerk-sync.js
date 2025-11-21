// This script can be scheduled to run periodically to keep the database in sync with Clerk
const { exec } = require('child_process');
const cron = require('node-cron');

// Schedule the sync to run every day at midnight
// You can adjust this schedule as needed
cron.schedule('0 0 * * *', () => {
  console.log('Running periodic Clerk user sync...');
  
  exec('npx ts-node scripts/sync-all-clerk-users.ts', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running sync: ${error}`);
      return;
    }
    
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    
    console.log(`stdout: ${stdout}`);
    console.log('Periodic Clerk user sync completed successfully!');
  });
});

console.log('Periodic Clerk user sync scheduler started. Will run daily at midnight.');
console.log('Press Ctrl+C to stop.');