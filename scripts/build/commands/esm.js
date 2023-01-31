const {buildES} = require('../../utils/build');
const {getAllPackages} = require('../../utils/package');
module.exports = {
  command: 'esm [packageName]',
  desc: 'Build a package for es module consumption',
  builder: {},
  handler: ({packageName}) => {
    console.log('mii',packageName)
    if(packageName === 'calling'){
      console.log('mii',packageName)
    }
    if (packageName === 'all') {
      const omitPrivatePackages = true;
      console.log('nsiar')
      return getAllPackages(omitPrivatePackages).forEach((pkg) => {
        buildES(pkg);
      });
    }
    
    if (packageName) {
      return buildES(packageName);
    }
    
    return false;
  }
};
