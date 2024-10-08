import {compose} from 'recompose';
import {constructWebexEnhancer, withIntl} from '@webex/webex-widget-base';
import {enhancer as mercuryEnhancer} from '@webex/redux-module-mercury';
import {enhancer as mediaEnhancer} from '@webex/redux-module-media';

import reducers from './reducer';
import ConnectedRecents from './container';
import messages from './translations/en';

export {reducers};

export default compose(
  constructWebexEnhancer({
    name: 'recents',
    reducers
  }),
  mercuryEnhancer,
  mediaEnhancer,
  withIntl({locale: 'en', messages})
)(ConnectedRecents);
