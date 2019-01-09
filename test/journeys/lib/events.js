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
 * Searches events object for matching event name
 *
 * @export
 * @param {object} options
 * @param {array} options.events
 * @param {string} options.eventName
 * @returns {(array)}
 */
export function findEventName({events, eventName}) {
  if (Array.isArray(events)) {
    return events.filter((val) => val.eventName === eventName);
  }

  return [];
}
