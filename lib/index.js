const { each } = require('lodash');

each(
  [
    'du',
    'enumerateFiles',
    'getSize',
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
