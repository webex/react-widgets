#!/usr/bin/env babel-node
const fs = require('fs');

const fse = require('fs-extra');
const request = require('request');

require('dotenv').config();

const username = process.env.SAUCE_USERNAME;
const accessKey = process.env.SAUCE_ACCESS_KEY;

function getSauceAsset(jobId, filename, destination) {
  return request.get(
    `https://${username}:${accessKey}@saucelabs.com/rest/v1/${username}/jobs/${jobId}/assets/${filename}`,
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        if (destination) {
          let targetDir = destination;
          const extension = destination.split('.').pop();
          if (extension && extension.length < 5) {
            [targetDir] = destination.split('.');
          }
          fse.mkdir(targetDir, (err) => {
            if (err) {
              console.error(err);
            }
            else {
              fs.writeFileSync(`${destination}`, body, 'utf8');
            }
          });
        }
        fs.writeFileSync(filename, body, 'utf8');
      }
      else {
        console.log(`Error ${response.statusCode}`);
      }
    }
  );
}

function getSauceConcurrency(callback) {
  request.get(
    `https://${username}:${accessKey}@saucelabs.com/rest/v1.1/users/${username}/concurrency`,
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(JSON.parse(body));
      }
      else {
        console.log(`Error ${response.statusCode}`);
      }
    }
  );
}

module.exports = {
  getSauceAsset,
  getSauceConcurrency
};

