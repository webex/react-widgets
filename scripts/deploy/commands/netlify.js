const path = require('path');
const fs = require('fs');

const netlify = require('netlify');
require('dotenv').config();

module.exports = {
  command: 'netlify <deployDir> [options]',
  desc: 'Publish a package to Netlify',
  builder: {
    deployDir: {
      describe: 'relative path to the directory you want to deploy'
    },
    saveUrlPath: {
      describe: 'save the deploy site url to a file at the provided path'
    }
  },
  handler: ({deployDir, saveUrlPath}) => {
    if (deployDir) {
      const siteId = process.env.NETLIFY_SITE_ID;
      const deployPath = path.resolve(process.cwd(), deployDir);
      if (!deployPath) {
        throw new Error(`No directory found at ${deployPath}`);
      }
      console.log(`Deploying ${deployDir} to ${siteId}`);
      return netlify.deploy({
        access_token: process.env.NETLIFY_ACCESS_TOKEN,
        site_id: siteId,
        dir: deployPath
      })
        .then((deploy) => {
          const deployUrl = deploy.deploy_ssl_url;
          console.log('Deploy successful!');
          console.log(deployUrl);
          if (saveUrlPath) {
            const saveUrl = path.resolve(process.cwd(), saveUrlPath);
            fs.writeFile(saveUrl, deployUrl, (err) => {
              if (err) {
                throw new Error('Could not write URL to file', err);
              }
              console.log(`Deploy URL written to ${saveUrlPath}`);
            });
          }
          return deployUrl;
        })
        .catch((error) => {
          if (error) {
            throw new Error('Something bad happened!', error);
          }
        });
    }
    return false;
  }
};
