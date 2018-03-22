import {loadWithGlobals} from '../../../lib/test-helpers';

import meetTests from './base';

meetTests({
  name: 'Global',
  browserSetup({
    aBrowser, accessToken, toPersonEmail, initialActivity
  }) {
    aBrowser
      .url('/space.html?meet')
      .execute(() => {
        localStorage.clear();
      });

    loadWithGlobals({
      aBrowser,
      accessToken,
      toPersonEmail,
      initialActivity
    });
  }
});
