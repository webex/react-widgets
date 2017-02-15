import runInPackage from './utils/base-package';

/**
 * Test a specific package with jest
 * @param  {string} pkgName Name of package without @ciscospark (e.g. react-component-button)
 * @param  {string} pkgPath Full path of package
 * @returns {Promise}
 */
export default function jestPackage(pkgName, pkgPath) {
  return runInPackage({
    constructCommand: (targetPath) => `npm run jest ${targetPath}/*`,
    commandName: `Start Package`,
    pkgName,
    pkgPath
  });
}

// Pass pkgName if running from command line
if (require.main === module) {
  jestPackage(process.argv[process.argv.length - 1]).catch((err) => {
    console.error(err);
    throw new Error(`test-package.js error \n ${err}`);
  });
}
