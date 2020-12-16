const { reduce } = require('lodash');
const { enumerateFiles, scanFile } = require('.');

module.exports = async (target, options) => {
  const files = await enumerateFiles(target);

  const initialAccumulator = Promise.resolve({});

  const sequentialReducer = (promiseChain, file) => promiseChain.then(async (languages) => {
    const { language, lines } = await scanFile(file, options);
    /* eslint-disable no-param-reassign */
    languages[language] = languages[language] || { files: 0, lines: 0 };
    languages[language].files += 1;
    languages[language].lines += lines;
    /* eslint-enable no-param-reassign */
    return languages;
  });

  const languages = await reduce(files, sequentialReducer, initialAccumulator);
  return { languages };
};
