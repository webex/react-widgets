import {loadWithGlobals} from '../../../lib/test-helpers';

import meetTests from './base';

meetTests({
  name: 'Global',
  browserSetup({
    aBrowser,
    accessToken,
    initialActivity,
    spaceId
  }) {
    aBrowser
      .url('/space.html')
      .execute(() => {
        localStorage.clear();
      });

    loadWithGlobals({
      aBrowser,
      accessToken,
      spaceId,
      initialActivity
    });
  }
});
