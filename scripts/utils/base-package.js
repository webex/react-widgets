import path from 'path';
import {exec} from './exec';
import fs from 'fs';
import denodeify from 'denodeify';

const stat = denodeify(fs.stat);

/**
 * Starts a specific package with Webpack Dev Server
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {Promise}
 */
export default function runInPackage({constructCommand, commandName, pkgName, pkgPath}) {
  pkgPath = pkgPath || path.resolve(__dirname, `..`, `..`, `packages`, `node_modules`, `@ciscospark`, pkgName);
  return Promise.all([stat(pkgPath), stat(path.resolve(pkgPath, `package.json`)), stat(path.resolve(pkgPath, `src`))])
    .then((statObj) => {
      // If the folder doesn't exist do nothing
      if (!statObj[0].isDirectory() || !statObj[1].isFile() || !statObj[2].isDirectory()) {
        return false;
      }

      console.log(`${commandName} ${pkgName} ...`);
      const command = constructCommand(pkgPath);
      return exec(command)
        .catch((error) => {
          console.error(error.stdout);
          throw new Error(`Error when running ${commandName} on ${pkgName}`, error);
        });
    })
    .catch((error) => {
      console.error(error);
      throw new Error(`Error ${commandName} ${pkgName} package`, error);
    });
}
