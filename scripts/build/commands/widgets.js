const {
  webpackBuild,
  transpile
} = require('../../utils/build');
const {getWidgetPackages} = require('../../utils/package');

module.exports = {
  command: 'widgets',
  desc: 'Build all widgets',
  builder: {},
  handler: () => {
    getWidgetPackages().forEach((pkgPath) => {
      try {
        const pkgName = pkgPath.split('/').pop();

        transpile(pkgName, pkgPath);
        webpackBuild(pkgName, pkgPath);
      }
      catch (err) {
        throw err;
      }
    });
  }
};
