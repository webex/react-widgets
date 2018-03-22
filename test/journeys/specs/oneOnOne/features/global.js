import {loadWithGlobals} from '../../../lib/test-helpers';

import oneOnOneFeatureTests from './base';

oneOnOneFeatureTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, toPersonEmail}) {
    aBrowser
      .url('/space.html?basic')
      .execute(() => {
        localStorage.clear();
      });

    loadWithGlobals({
      aBrowser,
      accessToken,
      toPersonEmail,
      initialActivity: 'message'
    });
  }
});
