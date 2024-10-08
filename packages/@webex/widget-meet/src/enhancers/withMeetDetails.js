import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchSpace} from '@webex/redux-module-spaces';
import {getUser} from '@webex/redux-module-users';
import {fetchAvatar} from '@webex/redux-module-avatar';
import {validateAndDecodeId} from '@webex/react-component-utils';

import {storeMeetDetails} from '../actions';

import {destinationTypes} from '../';

function getCallDetails(props) {
  const {
    sparkInstance,
    avatar,
    spaces,
    users,
    currentUser,
    widgetMeet,
    media
  } = props;

  const {toType, toValue} = widgetMeet;

  switch (toType) {
    case destinationTypes.EMAIL:
      if (!users.getIn(['byEmail', toValue])) {
        props.getUser({email: toValue}, sparkInstance);
      }
      break;
    case destinationTypes.USERID:
      if (!users.getIn(['byId', toValue])) {
        props.getUser({id: toValue}, sparkInstance);
      }
      break;
    case destinationTypes.SPACEID:
      {
        const spaceShell = validateAndDecodeId(toValue);
        const space = spaces.getIn(['byId', spaceShell.id]);

        if (!space) {
          props.fetchSpace(sparkInstance, spaceShell)
            .then((s) => {
              if (s && s.locusUrl) {
                props.storeMeetDetails({callId: media.getIn(['byLocusUrl', s.locusUrl])});
              }
            });
        }
        else if (!space.isFetching
          && !avatar.hasIn(['items', space.id]) && !avatar.hasIn(['avatarsInFlight', space.id])
        ) {
          const otherUser = space.participants.find((p) => p !== currentUser.id);

          if (space.type !== 'direct'
            || (!avatar.hasIn(['items', otherUser]) && !avatar.hasIn(['avatarsInFlight', otherUser]))) {
            props.fetchAvatar({space, userId: otherUser}, sparkInstance);
          }
        }
      }
      break;
    default:
  }
}

export default compose(
  connect(
    null,
    (dispatch) => bindActionCreators({
      fetchSpace,
      fetchAvatar,
      storeMeetDetails,
      getUser
    }, dispatch)
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      // check to see if we have gotten currentUser and device is registered
      if (nextProps.currentUser) {
        getCallDetails(nextProps);
      }
    }
  })
);
