const { trim } = require('lodash');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = async (target) => {
  const { stdout } = await exec(`du -hLc ${target} | tail -1 | cut -f1`);
  return trim(stdout);
};
