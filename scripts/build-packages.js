import buildPackage from './build-package';
import fs from 'fs';
import denodeify from 'denodeify';

const readDir = denodeify(fs.readdir);

// Run buildPackage on all of our packages
readDir(`packages/node_modules/@ciscospark`)
  .then((packages) =>
    Promise.all(packages.map((pkg) => buildPackage(pkg)))
      .catch((error) => {
        throw new Error(error);
      })
  );
