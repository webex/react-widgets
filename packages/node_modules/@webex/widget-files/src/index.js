
import {compose} from 'recompose';
import {constructWebexEnhancer, withIntl} from '@webex/webex-widget-base';

import ConnectedFiles from './container';
import {reducers} from './reducer';
import messages from './translations/en';

export default compose(
  constructWebexEnhancer({
    name: 'files',
    reducers
  }),
  withIntl({locale: 'en', messages})
)(ConnectedFiles);
