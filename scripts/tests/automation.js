/* eslint-disable no-process-exit */
require(`dotenv`).config();

const fs = require(`fs`);
const path = require(`path`);
const argv = require(`minimist`)(process.argv.slice(2), {default: {config: `wdio.conf.js`}});
const Launcher = require(`webdriverio`).Launcher;
const globalFile = path.resolve(__dirname, `../../test/server/dist/globals.js`);

function launchWebdriver() {
  // Launch webdriverio
  const {config} = argv;
  const wdio = new Launcher(config);
  wdio
    .run()
    .then((result) => {
      process.exit(result);
    })
    .catch((error) => {
      console.error(`Launcher failed to start the test`, error.stacktrace);
      throw error;
    });
}


// Generate token file
const accessToken = process.env.CISCOSPARK_ACCESS_TOKEN;
const toPersonEmail = process.env.TO_PERSON_EMAIL;
const globalFileContents = `
window.accessToken = "${accessToken}";
window.toPersonEmail = "${toPersonEmail}";
`;
fs.writeFile(globalFile, globalFileContents, (err) => {
  if (err) {
    throw err;
  }
  launchWebdriver();
});
