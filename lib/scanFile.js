const { endsWith, find } = require('lodash');
const util = require('util');
const countLinesInFile = util.promisify(require('count-lines-in-file'));
const detect = util.promisify(require('language-detect'));
const { isBinaryFile } = require('isbinaryfile');

module.exports = async (file, { extraFileExtensions }) => {
  const isBinary = await isBinaryFile(file);

  let language = isBinary ? 'binary' : find(extraFileExtensions, (name, ext) => endsWith(file, ext));
  if (!language) language = (await detect(file)) || 'unknown';

  const lines = isBinary ? null : await countLinesInFile(file).catch(() => 0);

  return { file, language, lines };
};
