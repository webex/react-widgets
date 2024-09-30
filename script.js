const fs = require("fs");
const path = require("path");

// Function to update the package.json scripts in each package
function updatePackageJsonScripts(scripts, rootFolder) {
  // Read the root directory to find all package directories
  const packages = fs.readdirSync(rootFolder);

  packages.forEach((packageDir) => {
    const packageJsonPath = path.join(rootFolder, packageDir, "package.json");

    // Check if package.json exists in the package folder
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      // Get the package name and remove @webex/
      const packageName = packageJson.name.replace("@webex/", "");

      // Customize the build script with the package name
      const customizedScripts = {
        ...scripts,
        publish: scripts.publish.replace("<PACKAGE_NAME>", packageName),
      };

      // Merge the scripts into the package.json
      packageJson.scripts = {
        ...packageJson.scripts,
        ...customizedScripts,
      };

      // Write the updated package.json back to the file
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8"
      );

      console.log(`Updated scripts for: ${packageJson.name}`);
    } else {
      console.log(`package.json not found in ${packageDir}`);
    }
  });
}

// Define the scripts object to be added
const scriptsToAdd = {
  publish:
    "cross-env-shell NODE_ENV='' babel-node ../../../scripts/publish/index.js package <PACKAGE_NAME>",
};

// Example usage
const rootFolder = "packages/@webex"; // Replace with the actual path to your root folder
updatePackageJsonScripts(scriptsToAdd, rootFolder);
