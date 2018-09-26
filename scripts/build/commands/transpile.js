const {transpile, webpackTranspile} = require('../../utils/build');

module.exports = {
  command: 'transpile <packageName> [packagePath]',
  desc: 'Transpile a package with babel',
  builder: {},
  handler: ({packageName, packagePath}) => {
    if (packageName) {
      const command = packageName.includes('widget') ? webpackTranspile : transpile;
      if (packagePath) {
        command(packageName, packagePath);
      }
      else {
        command(packageName, `./packages/node_modules/@ciscospark/${packageName}`);
      }
    }
  }
};
