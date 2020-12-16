const util = require('util');
const glob = util.promisify(require('glob'));

const isFile = require('./isFile');

module.exports = async (target) => {
  if (await isFile(target)) {
    return [target];
  }
  return glob('**/*', { cwd: target, absolute: true, follow: false, nodir: true });
};
