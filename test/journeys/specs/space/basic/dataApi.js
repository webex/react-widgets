import {loadWithDataApi} from '../../../lib/test-helpers';

import groupBasicTests from './base';

groupBasicTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, spaceId}) {
    aBrowser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });
    loadWithDataApi({
      bundle: '/dist-space/bundle.js',
      initialActivity: 'message',
      aBrowser,
      accessToken,
      spaceId
    });
  }
});
