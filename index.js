const { each } = require('lodash');
const { checksum, du, parseArgs, scanFiles } = require('./lib');

const extraFileExtensions = {
  '.conf': 'Shell',
  '.csv': 'Comma Separated Values',
  '.emblem': 'Emblem',
  '.fdoc': 'FDOC',
  '.ipynb': 'Jupyter Notebook',
  '.jmx': 'JMeter Maven Plugin',
  '.js.snap': 'Jest',
  '.jsx.snap': 'Jest',
  '.mdown': 'Markdown',
  '.pl': 'Perl', // language-detect considers .pl to be Prolog, but it rarely is
  '.ts': 'Typescript',
  '.ts.snap': 'Jest',
  '.tsx': 'Typescript',
  '.tsx.snap': 'Jest',
  '.tsv': 'Tab Separated Values',
};

parseArgs(process)
  .then(async ({ raw, target }) => {
    const { files: fileStats, languages } = await scanFiles(target, { extraFileExtensions });

    if (raw) {
      each(fileStats, ({ file, language, lines }) => {
        console.log(file, language, lines);
      });
      return;
    }

    console.log(`Target: ${target}`);

    const hash = await checksum(target);
    console.log(`Checksum: ${hash}`);

    const diskUsage = await du(target);
    console.log(`Disk Usage: ${diskUsage}`);

    const arr = [];
    each(languages, ({ files, lines }, language) => {
      arr.push([language, files, lines]);
    });
    arr.sort((a, b) => b[2] - a[2]); // Sort by line count
    console.log('Languages:');
    each(arr, ([language, files, lines]) => {
      console.log(`  ${language}: ${files} files, ${lines} lines`);
    });
  })
  .catch((err) => {
    console.error(`Error: ${err.message || err}`);
    process.exit(1);
  });
