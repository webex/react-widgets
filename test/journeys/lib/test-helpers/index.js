import uuid from 'uuid';
import SauceLabs from 'saucelabs';

/**
 * Move mouse a specified amount of pixels
 * Origin is set to the element that matches the selector passed
 * Mouse is then moved from the origin by the x and y offset
 * @param {Object} aBrowser
 * @param {string} selector
 * @param {integer} [offsetX=0]
 * @param {integer} [offsetY=0]
 * @returns {void}
 */
export function moveMouse(aBrowser, selector) {
  if (aBrowser.desiredCapabilities.browserName.toLowerCase().includes('firefox')) {
    // Find center point of element
    const {x: elementX, y: elementY} = aBrowser.getLocation(selector);
    const {height, width} = aBrowser.getElementSize(selector);

    const x = Math.round(elementX + width / 2);
    const y = Math.round(elementY + height / 2);
    aBrowser.actions([{
      type: 'pointer',
      id: `mouse-${uuid.v4()}`,
      actions: [
        {
          type: 'pointerMove',
          duration: 0,
          x,
          y
        }
      ]
    }]);
  }
  else {
    aBrowser.moveToObject(selector);
  }
}

/**
 * Reload each active sauce session to a fresh session
 * and name session according to suite
 * @param {string} name
 * @returns {void}
 */
export function renameSession(name) {
  const browserName = process.env.BROWSER || 'chrome';
  const platform = process.env.PLATFORM || 'mac 10.12';
  if (process.env.SAUCE && process.env.INTEGRATION) {
    const account = new SauceLabs({
      username: process.env.SAUCE_USERNAME,
      password: process.env.SAUCE_ACCESS_KEY
    });
    account.getJobs((err, jobs) => {
      const widgetJobs = jobs.filter((job) => job.name === 'react-widget-integration' && job.consolidated_status === 'in progress'
             && job.os.toLowerCase().includes(platform) && job.browser.toLowerCase().includes(browserName));
      widgetJobs.forEach((job) => account.updateJob(job.id, {name}));
    });
  }
}
