const checksum = require('./lib/checksum');
const du = require('./lib/du');
const parseArgs = require('./lib/parseArgs');

parseArgs(process)
  .then(async ({ target }) => {
    const hash = await checksum(target);
    const diskUsage = await du(target);
    console.log(`Target: ${target}`);
    console.log(`Checksum: ${hash}`);
    console.log(`Disk Usage: ${diskUsage}`);
  })
  .catch((err) => {
    console.error(`Error: ${err.message || err}`);
    process.exit(1);
  });
