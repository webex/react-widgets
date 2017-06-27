import buildPackage from './dist';
import {getWidgetPackages} from './utils/package';

// Run buildPackage on all of our packages
const widgets = getWidgetPackages();
widgets.map((pkg) => {
  try {
    const pkgName = pkg.split(`/`).pop();
    return buildPackage(pkgName);
  }
  catch (err) {
    throw err;
  }
});
