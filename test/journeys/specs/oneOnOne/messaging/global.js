import {loadWithGlobals} from '../../../lib/test-helpers';

import messagingTests from './base';

messagingTests({
  name: 'Global',
  browserSetup({aBrowser, accessToken, toPersonEmail}) {
    aBrowser
      .url('/space.html?message')
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
