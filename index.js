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
  '.tsv': 'Tab Separated Values',
};

parseArgs(process)
  .then(async ({ target }) => {
    console.log(`Target: ${target}`);

    const hash = await checksum(target);
    console.log(`Checksum: ${hash}`);

    const diskUsage = await du(target);
    console.log(`Disk Usage: ${diskUsage}`);

    const { languages } = await scanFiles(target, { extraFileExtensions });

    console.log('Languages:');
    each(languages, ({ files, lines }, language) => {
      console.log(`  ${language}: ${files} files, ${lines} lines`);
    });
  })
  .catch((err) => {
    console.error(`Error: ${err.message || err}`);
    process.exit(1);
  });
