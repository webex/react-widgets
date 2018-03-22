import {loadWithDataApi} from '../../../lib/test-helpers';

import meetTests from './base';

meetTests({
  name: 'Data API',
  browserSetup({
    aBrowser,
    accessToken,
    initialActivity,
    spaceId
  }) {
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
      initialActivity
    });
  }
});
