const lstat = require('./lstat');

module.exports = async (file) => {
  const { size } = await lstat(file);
  return size;
};
