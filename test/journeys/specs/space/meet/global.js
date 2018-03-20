import {loadWithGlobals} from '../../../lib/test-helpers';

import globalMeetTests from './base';

globalMeetTests({
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
