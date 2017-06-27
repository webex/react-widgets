const {babelBuild} = require(`../../utils/build`);

module.exports = {
  command: `es <packageName> [packagePath]`,
  desc: `Transpile a package with babel`,
  builder: {},
  handler: ({packageName, packagePath}) => {
    if (packageName) {
      if (packagePath) {
        return babelBuild(packageName, packagePath);
      }
      return babelBuild(packageName, `./packages/node_modules/@ciscospark/${packageName}`);
    }
    return false;
  }
};
