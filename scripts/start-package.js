import path from 'path';
import runInPackage from './utils/base-package';

/**
 * Starts a specific package with Webpack Dev Server
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {Promise}
 */
export default function startPackage(pkgName, pkgPath) {
  return runInPackage({
    constructCommand: (targetPath) => `npm run start -- --context ${path.resolve(targetPath, `src`)}`,
    commandName: `Start Package`,
    pkgName,
    pkgPath
  });
}

// Pass pkgName if running from command line
if (require.main === module) {
  startPackage(process.argv[process.argv.length - 1]).catch((err) => {
    console.error(err);
    throw new Error(`start-package.js error \n ${err}`);
  });
}
