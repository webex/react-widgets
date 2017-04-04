import path from 'path';
import buildPackage from './build-package';
import {getAllPackages} from './utils/package';

// Run buildPackage on all of our packages
console.log(new Date());
getAllPackages().map((pkg) => {
  try {
    const pkgName = require(path.resolve(pkg, `package.json`)).name.split(`/`).pop();
    return buildPackage(pkgName, pkg);
  }
  catch (err) {
    throw err;
  }
});
console.log(new Date());
