import {
  camelCase,
  kebabCase
} from 'lodash';

function getDataAttributes(el) {
  const data = {};

  if (el) {
    const attribs = el.attributes;

    for (let i = 0; i < attribs.length; i += 1) {
      const {name} = attribs[i];
      const {value} = attribs[i];

      if (name.startsWith('data-') && name !== 'data-toggle') {
        data[camelCase(name.replace('data-', ''))] = value;
      }
    }
  }

  return data;
}


function loadWidgets({name}) {
  const widgets = document.querySelectorAll(`[data-toggle^="webex-${kebabCase(name)}"]`);

  for (const widget of widgets) {
    // grab all data attributes that are not data-toggle
    const props = getDataAttributes(widget);

    // Use browser globals to init widget if available
    if (window.webex.widget) {
      const widgetObj = window.webex.widget(widget);
      const widgetName = `${name}Widget`;

      if (typeof widgetObj[widgetName] === 'function') {
        widgetObj[widgetName](props);
      }
    }
  }
}


export default function withDataAPI({
  name
}) {
  const onDOMReady = () => {
    loadWidgets({name});
    document.removeEventListener('DOMContentLoaded', onDOMReady);
  };

  return (BaseComponent) => {
    // Only look for Widgets after the rest of the Widget constructor has initialized
    document.addEventListener('DOMContentLoaded', onDOMReady, false);

    return BaseComponent;
  };
}