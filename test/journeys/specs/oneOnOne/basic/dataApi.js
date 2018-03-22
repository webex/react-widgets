import {loadWithDataApi} from '../../../lib/test-helpers';

import oneOnOneBasicTests from './base';

oneOnOneBasicTests({
  name: 'Data API',
  browserLocalSetup({aBrowser, accessToken, toPersonEmail}) {
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
