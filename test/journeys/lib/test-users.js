import '@ciscospark/plugin-authorization';
import '@ciscospark/plugin-people';
import CiscoSpark from '@ciscospark/spark-core';
import {createUser} from '@ciscospark/test-helper-appid';

import {deconstructHydraId} from './hydra';

/**
 * Creates and sets up a test user via jwt
 * @param {object} options
 * @param {string} options.displayName
 * @returns {Promise<object>}
 */
export default function setupTestUserJwt({displayName}) {
  if (!(process.env.CISCOSPARK_APPID_ORGID && process.env.CISCOSPARK_APPID_SECRET)) {
    throw new Error('CISCOSPARK_APPID_ORGID and CISCOSPARK_APPID_SECRET are required to generate guest tokens');
  }

  return createUser({displayName})
    .then(({jwt}) => {
      const guestSpark = new CiscoSpark();
      return guestSpark.authorization.requestAccessTokenFromJwt({jwt}).then(() =>
        // We don't have a user id for guest users until a record is looked up
        guestSpark.people.get('me').then((p) => {
          const guestUser = Object.assign({}, p);
          // id is hydra from get people, but is expected to be a uuid
          const {id} = deconstructHydraId(p.id);
          guestUser.id = id;
          const email = p.emails[0];
          guestUser.email = email;
          guestUser.jwt = jwt;
          guestUser.spark = guestSpark;
          return guestUser;
        }));
    })
    .catch((e) => {
      console.error('Unable to create test user');
      console.error(e);
      throw (e);
    });
}
