import {compose, lifecycle} from 'recompose';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {deconstructHydraId} from '@webex/react-component-utils';

import {storeMeetDetails} from '../actions';

import {destinationTypes} from '../';

function storeDestinationType(props) {
  const {
    destination,
    call
  } = props;
  const details = {};

  if (destination && !call) {
    let toValue = destination.id;

    // Normalize To values and store
    switch (destination.type) {
      case destinationTypes.SIP:
        toValue = toValue.replace('sip:', '');
        break;
      case destinationTypes.USERID:
        {
          const hydraObject = deconstructHydraId(toValue);

          toValue = hydraObject.id;
        }
        break;
      default:
        break;
    }

    details.toType = destination.type;
    details.toValue = toValue;

    props.storeMeetDetails(details);
  }
}

export default compose(
  connect(
    null,
    (dispatch) => bindActionCreators({
      storeMeetDetails
    }, dispatch)
  ),
  lifecycle({
    componentWillMount() {
      storeDestinationType(this.props);
    }
  })
);