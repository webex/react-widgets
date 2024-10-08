const {transpile} = require('../../utils/build');
const {getAllPackages} = require('../../utils/package');

module.exports = {
  command: 'transpile <packageName> [packagePath]',
  desc: 'Transpile a package with babel',
  builder: {},
  handler: ({packageName, packagePath}) => {
    if (packageName) {
      if (packageName === 'all') {
        const omitPrivatePackages = true;

        getAllPackages(omitPrivatePackages).forEach((pkg) => {
          transpile(pkg, `./packages/${pkg}`);
        });
      }
      else {
        if (packagePath) {
          transpile(packageName, packagePath);
        }
        transpile(packageName, `./packages/@webex/${packageName}`);
      }
    }
  }
};
