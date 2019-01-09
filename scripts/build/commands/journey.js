const path = require('path');

const fse = require('fs-extra');
const rimraf = require('rimraf');

const {execSync} = require('../../utils/exec');

module.exports = {
  command: 'journey <distPath>',
  desc: 'Bundle the main widgets into a distributable folder for journey testing',
  builder: {
    distPath: {
      describe: 'path to output test distributables',
      default: './dist-test'
    }
  },
  handler: ({distPath}) => {
    process.env.NODE_ENV = 'test';
    if (distPath) {
      const cwd = process.cwd();
      const dest = path.resolve(cwd, distPath);

      rimraf.sync(dest);
      fse.ensureDir(dest)
        .then(() => {
          fse.copy(path.resolve(cwd, './test/journeys/server'), dest);
          const axeCore = path.join(dest, 'axe-core');

          fse.mkdir(axeCore)
            .then(() => {
              fse.copy(path.resolve(cwd, './node_modules/axe-core'), axeCore);
            });
          execSync(`BUILD_DIST_PATH=${dest}/dist-space npm run build:package widget-space`);
          execSync(`BUILD_DIST_PATH=${dest}/dist-recents npm run build:package widget-recents`);
          execSync(`BUILD_DIST_PATH=${dest}/dist-demo npm run build:package widget-demo`);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return false;
  }
};
