import {compose} from 'recompose';
import {constructWebexEnhancer, withIntl} from '@webex/webex-widget-base';

import {reducers} from './reducer';
import ConnectedMessage from './container';

import messages from './translations/en';

export {reducers};

export const destinationTypes = {
  EMAIL: 'email',
  USERID: 'userId',
  SPACEID: 'spaceId'
};

export default compose(
  constructWebexEnhancer({
    name: 'message',
    reducers
  }),
  withIntl({locale: 'en', messages})
)(ConnectedMessage);
