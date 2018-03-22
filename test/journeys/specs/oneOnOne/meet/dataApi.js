import {loadWithDataApi} from '../../../lib/test-helpers';

import meetTests from './base';

meetTests({
  name: 'Data API',
  browserSetup({
    aBrowser, accessToken, toPersonEmail, initialActivity
  }) {
    loadWithDataApi({
      aBrowser,
      initialActivity,
      accessToken,
      toPersonEmail
    });
  }
});
