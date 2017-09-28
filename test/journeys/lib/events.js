/**
 * Clears the event log (array) in the passed browser
 *
 * @export
 * @param {any} myBrowser
 * @returns {void}
 */
export function clearEventLog(myBrowser) {
  myBrowser.execute(() => {window.ciscoSparkEvents.length = 0;});
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
      if (event.detail && event.detail.data && event.detail.data.hasOwnProperty(`call`)) {
        Reflect.deleteProperty(event.detail.data, `call`);
      }
      return event;
    });
    return events;
  });
  return result.value;
}
