const { trim } = require('lodash');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async (target) => {
  const { stdout: md5hash } = await exec(
    `find -s ${target} -type f -exec md5sum {} \\; | md5sum | cut -f1 -d ' '`
  );
  return trim(md5hash);
};
