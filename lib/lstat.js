const util = require('util');
module.exports = util.promisify(require('fs').lstat);
