import {loadWithDataApi} from '../../lib/test-helpers';

import recentTests from './base';

recentTests({
  name: 'Widget Recents: Data API',
  browserLocalSetup({aBrowser, accessToken}) {
    aBrowser
      .url('/data-api/recents.html')
      .execute(() => {
        localStorage.clear();
      });
    loadWithDataApi({
      aBrowser,
      accessToken,
      bundle: '/dist-recents/bundle.js',
      widget: 'recents'
    });
  }
});
