import {setDisplayName, compose} from 'recompose';

import withErrors from './withErrors';
import withEventHandler from './withEventHandler';
import withCallHandlers from './withCallHandlers';
import withDestinationType from './withDestinationType';
import withMeetDetails from './withMeetDetails';

export default compose(
  setDisplayName('WidgetMeetEnhancers'),
  withEventHandler,
  withDestinationType,
  withMeetDetails,
  withCallHandlers,
  withErrors
);