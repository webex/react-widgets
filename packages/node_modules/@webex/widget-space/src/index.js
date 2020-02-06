import {compose} from 'recompose';
import {constructWebexEnhancer, withIntl} from '@webex/webex-widget-base';
import {enhancer as mercuryEnhancer} from '@webex/redux-module-mercury';

import reducers from './reducer';
import ConnectedSpace from './container';
import messages from './translations/en';
import events from './events';
import {destinationTypes} from './constants';

const {eventNames} = events;

export {eventNames};

export {reducers};

export {destinationTypes};

export default compose(
  constructWebexEnhancer({
    name: 'space',
    reducers
  }),
  mercuryEnhancer,
  withIntl({locale: 'en', messages})
)(ConnectedSpace);
