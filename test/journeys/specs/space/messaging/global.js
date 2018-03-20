import {loadWithGlobals} from '../../../lib/test-helpers';

import messagingTests from './base';

messagingTests({
  name: 'Global',
  browserSetup({aBrowser, accessToken, spaceId}) {
    aBrowser
      .url('/space.html')
      .execute(() => {
        localStorage.clear();
      });

    loadWithGlobals({
      aBrowser,
      accessToken,
      spaceId,
      initialActivity: 'message'
    });
  }
});
