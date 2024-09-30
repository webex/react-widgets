import {compose} from 'recompose';
import {constructWebexEnhancer, withIntl} from '@webex/webex-widget-base';

import ConnectedMeetingsWidget from './container';

import reducers from './reducer';

import messages from './translations/en';

export {reducers};

export const destinationTypes = {
  SIP: 'sip',
  EMAIL: 'email',
  USERID: 'userId',
  SPACEID: 'spaceId',
  PSTN: 'pstn'
};

export default compose(
  constructWebexEnhancer({
    name: 'meetings',
    reducers
  }),
  withIntl({locale: 'en', messages})
)(ConnectedMeetingsWidget);
