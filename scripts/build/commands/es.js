const path = require(`path`);
const rimraf = require(`rimraf`);
const {execSync} = require(`../../utils/exec`);

module.exports = {
  command: `babel <packageName> [packagePath]`,
  desc: `Transpile a package with babel`,
  builder: {},
  handler: ({packageName, packagePath}) => {
    console.log(`stupid`);
    if (packageName) {
      if (packagePath) {
        return babelBuild(packageName, packagePath);
      }
      return babelBuild(packageName, `./packages/node_modules/@ciscospark/${packageName}`);
    }
    return false;
  },
  babelBuild
};
