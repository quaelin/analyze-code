const lstat = require('./lstat');

module.exports = async (target) => {
  const stats = await lstat(target);
  return stats.isFile();
};
