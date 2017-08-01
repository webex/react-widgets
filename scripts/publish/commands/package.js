const {npmPublishPackage, npmPublishAll} = require(`../../utils/publish`);

module.exports = {
  command: `package <packageName>`,
  desc: `Publish a package to NPM`,
  builder: {},
  handler: ({packageName}) => {
    if (packageName) {
      switch (packageName.toLowerCase()) {
      case `all`:
        return npmPublishAll();
      default:
        return npmPublishPackage(packageName);
      }
    }
    return false;
  }
};
