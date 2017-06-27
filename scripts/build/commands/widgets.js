const {webpackBuild} = require(`../../utils/build`);
const {getWidgetPackages} = require(`../../utils/package`);

module.exports = {
  command: `widgets`,
  desc: `Build all widgets`,
  builder: {},
  handler: () => {
    getWidgetPackages().map((pkg) => {
      try {
        const pkgName = pkg.split(`/`).pop();
        return webpackBuild(pkgName);
      }
      catch (err) {
        throw err;
      }
    });
  }
};
