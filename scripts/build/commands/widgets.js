const {
  webpackBuild,
  transpile
} = require(`../../utils/build`);
const {getWidgetPackages} = require(`../../utils/package`);

module.exports = {
  command: `widgets`,
  desc: `Build all widgets`,
  builder: {},
  handler: () => {
    getWidgetPackages().map((pkgPath) => {
      try {
        const pkgName = pkgPath.split(`/`).pop();
        return Promise.all([
          transpile(pkgName, pkgPath),
          webpackBuild(pkgName, pkgPath)
        ]);
      }
      catch (err) {
        throw err;
      }
    });
  }
};
