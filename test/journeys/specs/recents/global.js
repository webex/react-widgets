import {loadWithGlobals} from '../../lib/test-helpers';

import recentTests from './base';

recentTests({
  name: 'Widget Recents: Global',
  browserLocalSetup({aBrowser, accessToken}) {
    aBrowser
      .url('/recents.html')
      .execute(() => {
        localStorage.clear();
      });
    loadWithGlobals({
      aBrowser,
      accessToken
    });
  }
});

