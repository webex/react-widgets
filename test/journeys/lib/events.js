/**
 * Clears the event log (array) in the passed browser
 *
 * @export
 * @param {any} myBrowser
 * @returns {void}
 */
export function clearEventLog(myBrowser) {
  myBrowser.execute(() => { window.ciscoSparkEvents = []; });
}

/**
 * Gets the event log (array) from the passed browser
 *
 * @export
 * @param {any} myBrowser
 * @returns {Array}
 */
export function getEventLog(myBrowser) {
  const result = myBrowser.execute(() => {
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
 *
 * @export
 * @param {Object} aBrowser
 * @returns {Array}
 */
export function getEventNames(aBrowser) {
  const events = getEventLog(aBrowser);
  return events.map((e) => e.eventName);
}
