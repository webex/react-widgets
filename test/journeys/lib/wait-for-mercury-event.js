/**
 * Blocks control flow until the specifed event type gets emitted
 * @param {Spark} spark
 * @param {string} eventName
 * @returns {Object}
 */
export default function waitForMercuryEvent(spark, eventName) {
  let event;

  browser.waitUntil(() => new Promise((resolve) => spark.internal.mercury.once(eventName, (e) => {
    event = e;
    resolve(true);
  })));

  return event;
}
