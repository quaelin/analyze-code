const { map } = require('lodash');
const { dirname } = require('path');
const fastGlob = require('fast-glob');

const isFile = require('./isFile');

module.exports = async (target, { absolute, debug, ignores }) => {
  const options = {
    cwd: target,
    absolute,
    followSymbolicLinks: false,
    onlyFiles: true,
    unique: true,
    ignore: ignores,
  };
  let pattern = '**/*';
  if (await isFile(target)) {
    pattern = target;
    options.cwd = dirname(target);
  }
  const excludePatterns = map(ignores, (ptn) => `!${ptn}`);
  const patterns = [pattern, ...excludePatterns];
  if (debug) {
    console.log('fastGlob', patterns, options);
  }
  return fastGlob(patterns, options);
};
