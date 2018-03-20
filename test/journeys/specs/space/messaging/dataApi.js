import {loadWithDataApi} from '../../../lib/test-helpers';

import messagingTests from './base';

messagingTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, spaceId}) {
    aBrowser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });

    loadWithDataApi({
      aBrowser,
      bundle: '/dist-space/bundle.js',
      accessToken,
      spaceId,
      initialActivity: 'message'
    });
  }
});
