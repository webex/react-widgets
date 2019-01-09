const {startPackage} = require('../../utils/package');

module.exports = {
  command: 'package <widgetName>',
  desc: 'Start a widget',
  builder: {},
  handler: ({widgetName}) => {
    let pkgName;

    if (widgetName.startsWith('widget-')) {
      pkgName = widgetName;
    }
    else {
      pkgName = `widget-${widgetName}`;
    }

    return startPackage(pkgName);
  }
};
