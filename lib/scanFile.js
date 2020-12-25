const { endsWith, find } = require('lodash');
const { promisify } = require('util');
const countLinesInFile = promisify(require('count-lines-in-file'));
const detect = promisify(require('language-detect'));
const { isBinaryFile } = require('isbinaryfile');

const getSize = require('./getSize');

module.exports = async (file, { extraFileExtensions }) => {
  const isBinary = await isBinaryFile(file);

  let language = isBinary ? 'binary' : find(extraFileExtensions, (name, ext) => endsWith(file, ext));
  if (!language) language = (await detect(file)) || 'unknown';

  const lines = isBinary ? null : await countLinesInFile(file).catch(() => 0);

  const bytes = await getSize(file);

  return { file, language, lines, bytes };
};
