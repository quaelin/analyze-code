const minimist = require('minimist');
const path = require('path');

module.exports = async ({ argv }) => {
  const args = minimist(argv.slice(2));

  const originalTarget = args._.shift();
  if (!originalTarget) {
    throw new Error('No target specified');
  }

  args.target = path.resolve(originalTarget);

  return args;
};
