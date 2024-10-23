import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import Events from 'ampersand-events';

function formatEventDetails({name, data}) {
  const [resource, eventName] = name.split(':');
  const details = {
    resource,
    event: eventName,
    data
  };

  if (data.actorId) {
    details.actorId = data.actorId;
  }

  if (data.action) {
    details.action = data.action;
  }

  return details;
}

function BrowserWidget(el) {
  this.el = el;
  this.remove = (callback) => new Promise((resolve) => {
    const id = this.el.getAttribute('data-uuid');
    // Unmount React Component
    const removed = ReactDOM.unmountComponentAtNode(el);

    // Remove from widgetStore
    Reflect.deleteProperty(window.webex.widgetStore, id);

    // Fire callback
    if (typeof callback === 'function') {
      return callback(removed);
    }

    return resolve(removed);
  });

  function handleEvent(name, data) {
    if (this.el) {
      // Don't nest data if the event data object is already constructed
      const detail = data.data ? data : formatEventDetails({name, data});
      // Dispatch DOM event
      const event = new CustomEvent(name, {
        detail
      });

      this.el.dispatchEvent(event);

      // Trigger ampersand events
      this.trigger(name, detail);
    }

    return this;
  }

  this.handleEvent = handleEvent;
  this.version = process.env.REACT_WEBEX_VERSION;

  // Attach event handlers to each widget
  const widgetFn = {};

  Object.keys(window.webex.widgetFn).forEach((fn) => {
    const func = window.webex.widgetFn[fn];

    widgetFn[fn] = (options) => {
      const onEvent = (name, data) => {
        this.handleEvent(name, data);
        if (typeof options.onEvent === 'function') {
          options.onEvent(name, formatEventDetails({name, data}));
        }
      };

      return func.call(this, {
        ...options,
        onEvent: onEvent.bind(this)
      });
    };
  });

  Object.assign(this, widgetFn);

  return this;
}


/**
 * Takes a DOM element and returns a widget or initializes it as a widget element
 * @param {Element} el
 * @returns {Object}
 */
function getWidget(el) {
  /**
   * Creates a new widget object and stores it
   * @param  {object} widgetEl HTML element where a widget is mounted
   * @returns {object} widgetObject
   */
  function createNewWidget(widgetEl) {
    Object.assign(BrowserWidget.prototype, Events);
    const widgetObj = new BrowserWidget(widgetEl);

    const id = uuid.v4();

    // Store ID as attribute on dom element
    widgetEl.setAttribute('data-uuid', id);
    window.webex.widgetStore[id] = widgetObj;

    return widgetObj;
  }

  /**
   * Retrieves a Widget from global widget store
   * @param  {object} widgetEl HTML element where a widget is mounted
   * @returns {object} widgetObject
   */
  function selectWidget(widgetEl) {
    // Check if element exists and is HTML Element
    if (widgetEl && widgetEl.nodeType === 1) {
      // Get ID as attribute on dom element
      const id = widgetEl.getAttribute('data-uuid');

      // Add class
      widgetEl.classList.add('webex-widget');
      // Get widget from store if it exists
      const widgetObj = window.webex.widgetStore[id];

      if (widgetObj) {
        return widgetObj;
      }

      // Otherwise create new widget store
      return createNewWidget(widgetEl);
    }
    console.warn('WARNING: webex.widget: No HTML element provided.'); // eslint-disable-line no-console

    return false;
  }

  return selectWidget(el);
}


function setupWidgetNamespace() {
  if (!window.webex) {
    window.webex = {};
  }
  if (!window.webex.widgetStore) {
    window.webex.widgetStore = {};
  }
  if (!window.webex.widgetFn) {
    window.webex.widgetFn = {};
  }
  if (!window.webex.widget || typeof window.webex.widget !== 'function') {
    window.webex.widget = getWidget;
  }
  // Legacy Support
  if (!window.ciscospark) {
    window.ciscospark = window.webex;
  }
}

/**
 * HOC that registers widget to browser globals
 * @param {String} name of widget to use
 * @returns {Function}
 */
export default function withBrowserGlobals({name}) {
  // Inject widget into browser globals
  setupWidgetNamespace();
  const fnName = `${name}Widget`;

  return (BaseComponent) => {
    function renderWidget(options) {
      const {el} = this;
      const {onEvent, ...otherOptions} = options;

      // Instantiate Component into DOM
      ReactDOM.render(<BaseComponent onEvent={onEvent} {...otherOptions} />, el);

      return this;
    }

    // Set up this widget's init process
    // Allow dev to call window.webex.widget(EL).WIDGETNAME({options});
    if (typeof window.webex.widgetFn[fnName] === 'function') {
      // eslint-disable-reason Need to log console warning when widget already registered
      // eslint-disable-next-line no-console
      console.warn(`${name} Widget is already registered.`);
    }
    else {
      window.webex.widgetFn[fnName] = renderWidget;
      // Attach version number statically. This will need to change when we publish widgets independently
      window.webex.widgetFn[fnName].version = process.env.REACT_WEBEX_VERSION;
    }

    return BaseComponent;
  };
}