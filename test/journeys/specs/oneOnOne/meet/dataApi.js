import {loadWithDataApi} from '../../../lib/test-helpers';

import meetTests from './base';

meetTests({
  name: 'Data API',
  browserSetup({
    aBrowser, accessToken, toPersonEmail, initialActivity
  }) {
    aBrowser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });

    loadWithDataApi({
      aBrowser,
      bundle: '/dist-space/bundle.js',
      initialActivity,
      accessToken,
      toPersonEmail
    });
  }
});
