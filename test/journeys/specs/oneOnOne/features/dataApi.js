import {loadWithDataApi} from '../../../lib/test-helpers';

import oneOnOneFeatureTests from './base';

oneOnOneFeatureTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, toPersonEmail}) {
    aBrowser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });

    loadWithDataApi({
      aBrowser,
      bundle: '/dist-space/bundle.js',
      initialActivity: 'message',
      accessToken,
      toPersonEmail
    });
  }
});
