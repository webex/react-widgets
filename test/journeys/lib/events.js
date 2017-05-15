/**
 * Clears the event log (array) in the passed browser
 *
 * @export
 * @param {any} myBrowser
 * @returns null
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
  const result = myBrowser.execute(() => window.ciscoSparkEvents);
  return result.value;
}
