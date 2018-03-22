import {loadWithGlobals} from '../../../lib/test-helpers';

import oneOnOneBasicTests from './base';

oneOnOneBasicTests({
  name: 'Global',
  browserLocalSetup({aBrowser, accessToken, toPersonEmail}) {
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
