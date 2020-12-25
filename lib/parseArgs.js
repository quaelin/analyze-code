const { each, includes } = require('lodash');
const minimist = require('minimist');
const path = require('path');

module.exports = async ({ argv }) => {
  const args = minimist(argv.slice(2));
  const validArgs = ['_', 'absolute', 'debug', 'format', 'ignore', 'raw', 'summary'];

  each(args, (val, name) => {
    if (!includes(validArgs, name)) {
      throw new Error(`Unexpected argument: ${name}`);
    }
  });

  const originalTarget = args._.shift();
  if (!originalTarget) {
    throw new Error('No target specified');
  }
  args.target = path.resolve(originalTarget);

  args.absolute = !!args.absolute;
  args.raw = !!args.raw;

  // summary defaults to true if `raw` not specified
  if (args.summary === undefined) args.summary = !args.raw;
  else args.summary = !!args.summary;

  const validFormatTypes = ['csv', 'json'];
  if (!args.format) {
    args.format = 'csv';
  }
  if (!includes(validFormatTypes, args.format)) {
    throw new Error(`Valid formats are ${validFormatTypes}`);
  }

  if (args.debug) {
    console.log('args', args);
  }
  return args;
};
