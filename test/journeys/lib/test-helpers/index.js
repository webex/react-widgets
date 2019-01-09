import uuid from 'uuid';
import SauceLabs from 'saucelabs';

// eslint-disable-next-line prefer-destructuring
const argv = require('yargs').argv;

export const jobNames = {
  recentsDataApi: 'react-widget-recents-dataApi',
  recentsGlobal: 'react-widget-recents-global',
  recentsFilterDataApi: 'react-widget-recents-filter-dataApi',
  recentsFilterGlobal: 'react-widget-recents-filter-global',
  space: 'react-widget-space-main',
  spaceGuest: 'react-widget-space-guest',
  spaceDataApi: 'react-widget-space-dataApi',
  spaceStartup: 'react-widget-space-startup',
  smokeInitial: 'react-widget-smoke-initial',
  smokeMultiple: 'react-widget-smoke-multiple',
  smokeRecents: 'react-widget-smoke-recents',
  smokeSpace: 'react-widget-smoke-space',
  smokeDemo: 'react-widget-smoke-demo'
};
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
 * Gets the widget jobs that includes the name passed
 * @param {string} name
 * @returns {Promise}
 */
function getWidgetJobs(name) {
  return new Promise((resolve, reject) => {
    const build = process.env.BUILD_NUMBER;
    const account = new SauceLabs({
      username: process.env.SAUCE_USERNAME,
      password: process.env.SAUCE_ACCESS_KEY
    });
    const browserName = process.env.BROWSER || 'chrome';
    const platform = process.env.PLATFORM || 'mac 10.12';

    account.getJobs((err, jobs) => {
      // Something terrible has happened if we cannot get jobs from sauce
      if (err) {
        reject(err);
      }
      const widgetJobs = jobs.filter((job) => job.build === build && job.name && job.name.includes(name) && job.status === 'in progress'
              && job.os.toLowerCase().includes(platform) && job.browser.toLowerCase().includes(browserName));

      resolve(widgetJobs);
    });
  });
}

/**
 * Updates the job on sauce
 * @param {string} id
 * @param {object} details
 * @returns {Promise}
 */
function updateJob(id, details) {
  return new Promise((resolve, reject) => {
    const account = new SauceLabs({
      username: process.env.SAUCE_USERNAME,
      password: process.env.SAUCE_ACCESS_KEY
    });

    account.updateJob(id, details, (err, response) => {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  });
}

/**
 * Reload each active sauce session to a fresh session
 * and name session according to suite
 * @param {string} name
 * @param {object} browser
 * @returns {Promise}
 */
export function renameJob(name) {
  if (!process.env.SAUCE) {
    return Promise.resolve();
  }

  const {suite} = argv || 'smoke';

  // 'unnamed' jobs are those which haven't been renamed
  // When we do browser.reload, it will create a new job with the initial name
  return getWidgetJobs(`react-widget-${suite}-unnamed`).then((widgetJobs) => {
    const promises = widgetJobs.map((job) => {
      const remoteName = job.name.includes('local') ? 'local' : 'remote';
      const jobName = `${name}-${remoteName}`;

      return updateJob(job.id, {name: jobName});
    });

    return Promise.all(promises);
  });
}

/**
 * Updates a job's status
 * @param {string} name
 * @param {boolean} passed
 * @returns {Promise}
 */
export function updateJobStatus(name, passed) {
  if (!process.env.SAUCE) {
    return Promise.resolve();
  }

  return getWidgetJobs(name).then((widgetJobs) => {
    const promises = widgetJobs.map((job) => updateJob(job.id, {passed}));

    return Promise.all(promises);
  });
}
