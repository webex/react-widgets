const {startPackage} = require('../../utils/package');

module.exports = {
  command: 'demo <widgetName>',
  desc: 'Start a widget demo',
  builder: {},
  handler: ({widgetName}) => {
    let pkgName;
    if (widgetName.startsWith('widget-')) {
      if (widgetName.endsWith('-demo')) {
        pkgName = widgetName;
      }
      else {
        pkgName = `${widgetName}-demo`;
      }
    }
    else if (widgetName.endsWith('-demo')) {
      pkgName = `widget-${widgetName}`;
    }
    else {
      pkgName = `widget-${widgetName}-demo`;
    }

    if (pkgName) {
      return startPackage(pkgName);
    }
    return Promise.reject(new Error(false));
  }
};
