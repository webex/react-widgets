


// Pass pkgName if running from command line
if (require.main === module) {
  buildPackage(process.argv[process.argv.length - 1]);
}
