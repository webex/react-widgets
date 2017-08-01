const path = require(`path`);
const {runInPackage} = require(`./package`);

export function npmPublishPackage(pkgName) {
  return runInPackage({
    constructCommand: (targetPath) => `cd ${path.resolve(targetPath)} && npm publish --access public`,
    commandName: `Publish Package to NPM`,
    pkgName
  });
}
