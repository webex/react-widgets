import path from 'path';
import buildPackage from './build-package';
import {getAllPackagePaths} from '../../utils/package';

// Run buildPackage on all of our packages
getAllPackagePaths().map((pkg) => {
  try {
    const pkgName = require(path.resolve(pkg, `package.json`)).name.split(`/`).pop();
    return buildPackage(pkgName, pkg);
  }
  catch (err) {
    throw err;
  }
});
