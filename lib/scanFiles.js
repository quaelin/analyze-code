const { map, pick } = require('lodash');
const { join } = require('path');
const particl = require('particl');
const customListeners = require('particl/dist/mixins/customListeners');
const { enumerateFiles, scanFile } = require('.');

const events = ['complete', 'error', 'file', 'scan', 'summary'];
const exportMethods = ['getSummary', 'onceComplete', 'onError', 'onScan'];

module.exports = (target, options) => {
  const { absolute, debug, ignores } = options;

  return pick(particl(
    map(events, customListeners),
    async ({ onFile, onScan, setError, setFile, setScan, setSummary, setComplete }) => {
      const languages = {};
      let filesNotYetScanned = 0;

      onFile(async (file) => {
        filesNotYetScanned += 1;
        setScan(await scanFile(join(target, file), options));
      });

      onScan(({ language, lines, bytes }) => {
        languages[language] = languages[language] || { files: 0, lines: 0, bytes: 0 };
        languages[language].files += 1;
        languages[language].lines += lines;
        languages[language].bytes += bytes;
        filesNotYetScanned -= 1;
        if (filesNotYetScanned === 0) {
          setSummary(languages);
          setComplete(true);
        }
      });

      try {
        (await enumerateFiles(target, { absolute, debug, ignores })).forEach(setFile);
      } catch (ex) {
        setError(ex);
        setSummary(ex);
        setComplete(false);
      }
    }
  ), exportMethods);
};
