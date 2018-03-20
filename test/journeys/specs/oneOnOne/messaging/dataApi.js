import {loadWithDataApi} from '../../../lib/test-helpers';

import messagingTests from './base';

messagingTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, toPersonEmail}) {
    aBrowser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });

    loadWithDataApi({
      aBrowser,
      accessToken,
      toPersonEmail,
      bundle: '/dist-space/bundle.js',
      initialActivity: 'message'
    });
  }
});
