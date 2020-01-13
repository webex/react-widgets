import {getPackage} from './utils/package';
import {execSync} from './utils/exec';


/**
 * Test a specific package with jest
 * @param  {string} pkgName Name of package without @webex (e.g. react-component-button)
 * @param  {string} pkgPath Full path of package
 * @returns {Promise}
 */
export default function jestPackage(pkgName, pkgPath) {
  const targetPkgPath = pkgPath || getPackage(pkgName);

  if (targetPkgPath) {
    try {
      execSync(`npm run jest ${targetPkgPath}/*`);
    }
    catch (error) {
      console.error(error.stdout);
      throw new Error(`Error when running jest on ${pkgName}`, error);
    }
  }

  return false;
}

// Pass pkgName if running from command line
if (require.main === module) {
  jestPackage(process.argv[process.argv.length - 1]);
}
