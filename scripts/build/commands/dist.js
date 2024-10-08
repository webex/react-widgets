const {webpackBuild} = require('../../utils/build');

module.exports = {
  command: 'dist <packageName> [packagePath]',
  desc: 'Bundle the package into a single distributable',
  builder: {},
  handler: ({packageName, packagePath}) => {
    if (packageName) {
      if (packagePath) {
        console.log(packageName, packagePath);
        return webpackBuild(packageName, packagePath);
      }
      console.log(packageName,'IN script');
      return webpackBuild(packageName);
    }

    return false;
  }
};
