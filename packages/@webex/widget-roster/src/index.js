import {compose} from 'recompose';
import {constructWebexEnhancer, withIntl} from '@webex/webex-widget-base';

import {reducers} from './reducer';
import ConnectedRoster from './container';
import messages from './translations/en';

export {reducers};

export default compose(
  constructWebexEnhancer({
    name: 'roster',
    reducers
  }),
  withIntl({locale: 'en', messages})
)(ConnectedRoster);
