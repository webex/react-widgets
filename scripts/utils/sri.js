const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const glob = require('glob');
const rimraf = require('rimraf');
const sriToolbox = require('sri-toolbox');

/**
 * Takes data as a string and generates an integrity hash using sha384
 * @param {Object} options
 * @param {String} options.data
 * @returns {String} integrity
 */
function generateSRI({
  data
}) {
  // generate SRI hash
  const integrity = sriToolbox.generate({
    algorithms: ['sha384']
  }, data);

  return integrity;
}

/**
 * Provides the signature for an SRI hash
 * @param {Object} options
 * @param {String} options.sri SRI hash
 * @param {String} options.privateKey
 * @returns {String} signature
 */
function signSRI({
  sri,
  privateKey
}) {
  if (!sri || !sri.length) {
    throw Error('No sri hash provided to sign');
  }
  // generate RSA signature
  const sign = crypto.createSign('RSA-SHA384');

  sign.write(sri);
  sign.end();

  return sign.sign({key: privateKey}, 'base64');
}

/**
 * Verifies signed string using public key
 * @param {Object} options
 * @param {String} options.data original signed string
 * @param {String} options.signature
 * @param {String} options.publicKey
 * @returns {Boolean}
 */
function verifySignature({
  data,
  signature,
  publicKey
}) {
  if (!data || !data.length) {
    throw Error('No data provided to verify');
  }
  // Verify that we signed correctly using public key
  const verify = crypto.createVerify('RSA-SHA384');

  verify.write(data);
  verify.end();

  return verify.verify(publicKey, signature, 'base64');
}

/**
 * Generates manifest file with SRI and signatures for a specific package
 * @param {Object} options
 * @param {String} options.packagePath path to widget package
 * @param {Buffer} options.privateKey data buffer from a utf8 encoded file
 * @param {String} options.publicKey utf8 encoded string from public key file
 * @returns {Boolean}
 */
function generateDistSRI({
  packagePath,
  privateKey,
  publicKey
}) {
  const pkgJson = require(path.resolve(packagePath, 'package.json'));

  // Check to ensure this is a package dir
  if (!pkgJson) {
    console.error(`No package.json found in: ${packagePath}`);

    return false;
  }

  // Remove old manifest if it exists
  rimraf.sync(path.resolve(packagePath, 'manifest.json'));

  // Get all distributable files
  const distFiles = glob.sync(path.join(packagePath, 'dist/**/*'), {nodir: true});

  if (distFiles && distFiles.length) {
    const fileList = [];

    distFiles.forEach((file) => {
      const data = fs.readFileSync(file, 'utf8');
      // Clean package name from path
      const name = file.replace(path.join(packagePath, 'dist', '/'), '');

      const sri = generateSRI({data});
      const signature = signSRI({sri, privateKey});
      const fileDetails = {
        name,
        signature,
        integrity: sri
      };

      // Insert CDN build path
      if (process.env.BUILD_PUBLIC_PATH) {
        fileDetails.url = `${process.env.BUILD_PUBLIC_PATH}${name}`;
      }

      if (verifySignature({data: sri, signature, publicKey})) {
        fileList.push(fileDetails);
      }
      else {
        throw Error('The generated SRI signature could not be verified');
      }
    });

    const manifest = {
      version: require('../../package.json').version,
      files: fileList
    };

    const jsonString = `${JSON.stringify(manifest, null, 2)}\n`;

    fs.writeFileSync(path.resolve(packagePath, 'dist/manifest.json'), jsonString, 'utf8');
  }

  return true;
}


module.exports = {
  generateSRI,
  generateDistSRI,
  verifySignature
};
