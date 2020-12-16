const { reduce } = require('lodash');
const { enumerateFiles, scanFile } = require('.');

module.exports = async (target, options) => {
  const allFiles = await enumerateFiles(target);

  const initialAccumulator = Promise.resolve({ languages: {}, files: [] });

  const sequentialReducer = (promiseChain, file) => promiseChain.then(async (acc) => {
    const { languages, files } = acc;
    const { language, lines } = await scanFile(file, options);
    files.push({ file, language, lines });
    /* eslint-disable no-param-reassign */
    languages[language] = languages[language] || { files: 0, lines: 0 };
    languages[language].files += 1;
    languages[language].lines += lines;
    /* eslint-enable no-param-reassign */
    return acc;
  });

  const { files, languages } = await reduce(allFiles, sequentialReducer, initialAccumulator);
  return { files, languages };
};
