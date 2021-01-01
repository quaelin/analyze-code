const { each } = require('lodash');
const { du, parseArgs, scanFiles } = require('./lib');

const extraFileExtensions = {
  '.conf': 'Shell',
  '.csv': 'Comma Separated Values',
  '.emblem': 'Emblem',
  '.fdoc': 'FDOC',
  '.ipynb': 'Jupyter Notebook',
  '.jmx': 'JMeter Maven Plugin',
  '.js.snap': 'Jest',
  '.jsx.snap': 'Jest',
  '.make': 'Makefile',
  '.mdown': 'Markdown',
  '.pl': 'Perl', // language-detect considers .pl to be Prolog, but it rarely is
  '.react.js': 'React',
  '.react.jsx': 'React',
  '.react.ts': 'React',
  '.react.tsx': 'React',
  '.ts': 'Typescript',
  '.ts.snap': 'Jest',
  '.tsx': 'Typescript',
  '.tsx.snap': 'Jest',
  '.tsv': 'Tab Separated Values',
};

const ignores = [
  '**/.git',
  '**/node_modules',
  '**/package-lock.json',
];

const out = (...args) => {
  console.log(...args);
};

parseArgs(process)
  .then(async ({ absolute, debug, format, raw, summary, target }) => {
    const scanner = scanFiles(
      target,
      { absolute, debug, extraFileExtensions, ignores }
    );

    scanner.onError((err) => { console.error(err); });

    if (raw) {
      scanner.onScan(({ file, language, lines, bytes }) => {
        if (format === 'csv') {
          out(`"${file}","${language}",${lines},${bytes}`);
        }
        if (format === 'json') {
          out(JSON.stringify({ file, language, lines, bytes }));
        }
      });
    }

    await scanner.onceComplete();

    if (summary) {
      const languages = scanner.getSummary();
      out(`Target: ${target}`);

      const diskUsage = await du(target);
      out(`Disk Usage: ${diskUsage}`);

      const arr = [];
      each(languages, ({ files, lines, bytes }, language) => {
        arr.push([language, files, lines, bytes]);
      });
      arr.sort((a, b) => b[2] - a[2]); // Sort by line count
      out('Languages:');
      each(arr, ([language, files, lines, bytes]) => {
        out(`  ${language}: ${files} files, ${lines} lines, ${bytes} bytes`);
      });
    }
  })
  .catch((err) => {
    console.error(`Error: ${err.message || err}`);
    process.exit(1);
  });
