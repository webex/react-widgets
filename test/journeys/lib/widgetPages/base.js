import uuid from 'uuid';

export default class BaseWidgetObject {
  get hasWidgetContainer() { return this.browser.isVisible(this.elements.widgetContainer); }

  get hasWidget() { return this.browser.isVisible(this.elements.widgetBody); }

  constructor({aBrowser, user}) {
    this.browser = aBrowser;
    this.user = user;
    this.elements = {
      widgetContainer: '.ciscospark-widget',
      widget: '.ciscospark-widget-body'
    };
  }

  open(page) {
    this.browser
      .url(page)
      .execute(() => {
        localStorage.clear();
      });
  }

  moveMouse(selector) {
    const aBrowser = this.browser;
    if (aBrowser.desiredCapabilities.browserName.toLowerCase().includes('firefox')) {
      // Find center point of element
      const {x: elementX, y: elementY} = aBrowser.getLocation(selector);
      const {height, width} = aBrowser.getElementSize(selector);

      const x = Math.round(elementX + width / 2);
      const y = Math.round(elementY + height / 2);
      aBrowser.actions([{
        type: 'pointer',
        id: `mouse-${uuid.v4()}`,
        parameters: {pointerType: 'mouse'},
        actions: [
          {
            type: 'pointerMove',
            duration: 0,
            x,
            y
          },
          {
            type: 'pause',
            duration: 500
          }
        ]
      }]);
    }
    else {
      aBrowser.moveToObject(selector);
    }
  }

  clickButton(button) {
    const aBrowser = this.browser;
    aBrowser.waitUntil(() =>
      aBrowser.isVisible(button),
    5000, `button (${button}) was not visible after 5s and could not be clicked`);
    aBrowser.click(button);
  }

  removeWidget() {
    this.browser.execute(() => {
      window.removeWidget();
    });
  }

  setPageTestName(testName) {
    console.log(testName);
    this.browser.execute((name) => {
      window.setTestName(name);
    }, testName);
  }

  clearEventLog() {
    return this.browser.execute(() => { window.ciscoSparkEvents = []; });
  }

  /**
   * Gets the event log (array) from the passed browser
   * @returns {Array}
   */
  getEventLog() {
    const result = this.browser.execute(() => {
      const events = window.ciscoSparkEvents.map((event) => {
        // Passing the call object from the browser causes an overflow
        if (event.detail && event.detail.data && Object.prototype.hasOwnProperty.call(event.detail.data, 'call')) {
          Reflect.deleteProperty(event.detail.data, 'call');
        }
        return event;
      });
      return events;
    });
    return result.value;
  }

  /**
   * Gets an array of event names from the browser
   * @returns {Array}
   */
  getEventNames() {
    const events = this.getEventLog();
    return events.map((e) => e.eventName);
  }
}
