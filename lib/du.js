const { trim } = require('lodash');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async (target) => {
  const { stdout } = await exec(`du -hLc ${target} | tail -1 | cut -f1`);
  return trim(stdout);
};
