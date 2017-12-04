const {webpackBuild} = require('../../utils/build');

module.exports = {
  command: 'dist <packageName> [packagePath]',
  desc: 'Bundle the package into a single distributable',
  builder: {},
  handler: ({packageName, packagePath}) => {
    if (packageName) {
      if (packagePath) {
        return webpackBuild(packageName, packagePath);
      }
      return webpackBuild(packageName, `./packages/node_modules/@ciscospark/${packageName}`);
    }
    return false;
  }
};
