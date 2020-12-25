const { trim } = require('lodash');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

module.exports = async (target) => {
  const { stdout: md5hash } = await exec(
    `find -s ${target} -type f -exec md5sum {} \\; | md5sum | cut -f1 -d ' '`
  );
  return trim(md5hash);
};
