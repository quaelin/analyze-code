const { each } = require('lodash');

each(
  [
    'checksum',
    'du',
    'enumerateFiles',
    'isFile',
    'lstat',
    'parseArgs',
    'scanFile',
    'scanFiles',
  ],
  (lib) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    module.exports[lib] = require(`./${lib}`);
  }
);
