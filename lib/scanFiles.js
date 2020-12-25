const { map } = require('lodash');
const particl = require('particl');
const customListeners = require('particl/dist/mixins/customListeners');
const { enumerateFiles, scanFile } = require('.');

module.exports = (target, options) => {
  const { absolute, debug, ignores, summary } = options;

  return particl(
    map(['error', 'file', 'scan', 'summary', 'complete'], (evt) => customListeners(evt)),
    async ({ setError, setFile, onFile, setScan, onScan, setSummary, setComplete }) => {
      const languages = {};

      onFile(async (file) => {
        setScan(await scanFile(file, options));
      });

      if (summary) {
        onScan(({ language, lines }) => {
          languages[language] = languages[language] || { files: 0, lines: 0 };
          languages[language].files += 1;
          languages[language].lines += lines;
        });
      }

      try {
        (await enumerateFiles(target, { absolute, debug, ignores })).forEach(setFile);
      } catch (ex) {
        setError(ex);
        setSummary(ex);
        setComplete(false);
      }

      if (summary) {
        setSummary(languages);
      }
      setComplete(true);
    }
  );
};
