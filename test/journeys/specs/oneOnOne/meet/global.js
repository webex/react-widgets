import {loadWithGlobals} from '../../../lib/test-helpers';

import meetTests from './base';

meetTests({
  name: 'Global',
  browserSetup({
    aBrowser, accessToken, toPersonEmail, initialActivity
  }) {
    loadWithGlobals({
      aBrowser,
      accessToken,
      toPersonEmail,
      initialActivity
    });
  }
});
