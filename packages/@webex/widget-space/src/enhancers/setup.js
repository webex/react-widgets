import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {fetchAvatar} from '@webex/redux-module-avatar';
import {resetConversation} from '@webex/redux-module-conversation';
import {resetErrors} from '@webex/redux-module-errors';
import {connectToMercury} from '@webex/redux-module-mercury';
import {fetchSpace} from '@webex/redux-module-spaces';
import {getUser} from '@webex/redux-module-users';
import {deconstructHydraId, validateAndDecodeId} from '@webex/react-component-utils';

import {
  getSpaceDetails,
  reloadWidget,
  storeDestination,
  updateWidgetStatus
} from '../actions';

import {getSpaceWidgetProps} from '../selector';

import {destinationTypes} from '../constants';

export function setup(props, prevProps = {}) {
  const {
    conversation,
    destination,
    errors,
    sparkInstance,
    sparkState,
    spaceDetails,
    widgetStatus,
    mercuryStatus,
    users,
    spaces
  } = props;

  if (sparkInstance
      && sparkState.authenticated
      && sparkState.registered
      && !sparkState.hasError
  ) {
    // Check if we need to reload space
    if (widgetStatus.shouldReloadWidget && prevProps && !prevProps.widgetStatus.shouldReloadWidget) {
      props.resetConversation();
      props.reloadWidget();
      props.resetErrors();
    }

    // Check for destination Change
    if (destination && prevProps.destination) {
      const previousDestination = prevProps.destination;

      if (
        destination.id !== previousDestination.id
        || destination.type !== previousDestination.type
      ) {
        sparkInstance.logger.info('Destination has changed, widget reloading...');
        props.updateWidgetStatus({
          shouldReloadWidget: true
        });
      }
    }

    // Connect to websocket (mercury)
    if (!mercuryStatus.hasConnected
      && !mercuryStatus.connecting
      && !mercuryStatus.connected
      && sparkState.registered) {
      props.connectToMercury(sparkInstance);
    }

    // Get space details for given destination
    // Get space details for given destination
    if (!widgetStatus.isFetchingSpaceDetails && !errors.get('hasError') && !spaceDetails) {
      // If the selector isn't returning a destination object and we have props for them, store
      if (destination) {
        // Use destination object from store to fetch space details
        props.getSpaceDetails({
          sparkInstance,
          destinationId: destination.id,
          destinationType: destination.type,
          intl: props.intl
        });
        // Fetch 1:1 User details
        if (destination.type === destinationTypes.EMAIL && !users.getIn(['byEmail', destination.id])) {
          props.getUser({email: destination.id}, sparkInstance);
        }
        if (destination.type === destinationTypes.USERID && !users.getIn(['byId', destination.id])) {
          props.getUser({id: destination.id}, sparkInstance);
        }
        if (destination.type === destinationTypes.SPACEID && !spaces.getIn(['byId', validateAndDecodeId(destination.id).id])) {
          props.fetchSpace(sparkInstance, validateAndDecodeId(destination.id));
        }
      }
      else {
        // Destination has not been stored yet, process and store.
        const {
          destinationId,
          destinationType
        } = props;
        let cluster;
        let id = destinationId;

        if (destinationType === destinationTypes.EMAIL && destinationId) {
          id = destinationId.toLowerCase();
        }
        else if (destinationType === destinationTypes.SPACEID && destinationId) {
          ({cluster} = deconstructHydraId(destinationId));
        }

        props.storeDestination({
          id,
          type: destinationType,
          // Add cluster if cluster information exists
          ...cluster && {cluster}
        });
      }
    }

    if (conversation.get('id')) {
      props.fetchAvatar({space: conversation.toJS()}, sparkInstance);
    }
  }
}

export default compose(
  connect(
    getSpaceWidgetProps,
    (dispatch) => bindActionCreators({
      connectToMercury,
      fetchSpace,
      getUser,
      getSpaceDetails,
      reloadWidget,
      resetConversation,
      resetErrors,
      storeDestination,
      updateWidgetStatus,
      fetchAvatar
    }, dispatch)
  ),
  lifecycle({
    componentWillMount() {
      setup(this.props);
    },
    shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    },
    componentWillReceiveProps(nextProps) {
      setup(nextProps, this.props);
    }
  })
);
