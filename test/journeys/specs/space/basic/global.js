import {loadWithGlobals} from '../../../lib/test-helpers';

import groupBasicTests from './base';

groupBasicTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, spaceId}) {
    aBrowser
      .url('/space.html')
      .execute(() => {
        localStorage.clear();
      });
    loadWithGlobals({
      initialActivity: 'message',
      aBrowser,
      accessToken,
      spaceId
    });
  }
});
