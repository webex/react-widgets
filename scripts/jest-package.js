import {getPackage} from './utils/package';
import {execSync} from './utils/exec';


/**
 * Test a specific package with jest
 * @param  {string} pkgName Name of package without @ciscospark (e.g. react-component-button)
 * @param  {string} pkgPath Full path of package
 * @returns {Promise}
 */
export default function jestPackage(pkgName, pkgPath) {
  pkgPath = pkgPath || getPackage(pkgName);
  if (pkgPath) {
    try {
      execSync(`npm run jest ${pkgPath}/*`);
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
