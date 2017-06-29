/* eslint-disable no-sync */
const {updatePackageJson} = require(`../../utils/deps`);

module.exports = {
  command: `package.json`,
  desc: `Update all package.json`,
  builder: {},
  handler: () => updatePackageJson()
};
