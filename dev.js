// dev.js
const findFreePort = require('find-free-port');
const { exec } = require('child_process');

findFreePort(3000, 3100, (err, freePort) => {
  if (err) {
    console.error('Error finding free port:', err);
    process.exit(1);
  }
  console.log(`Starting Next.js on port ${freePort}`);
  exec(`npx next dev -p ${freePort}`, (error, stdout, stderr) => {
    if (error) console.error(`Error: ${error.message}`);
    if (stderr) console.error(`Stderr: ${stderr}`);
    console.log(stdout);
  });
});