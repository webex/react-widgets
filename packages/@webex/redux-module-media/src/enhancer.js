import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, lifecycle} from 'recompose';

import {setWrappedDisplayName} from '@webex/react-component-utils';

import {
  listenForCalls
} from './actions';


export default compose(
  setWrappedDisplayName('WithMedia'),
  connect(
    (state) => ({
      sparkInstance: state.spark.get('spark'),
      media: state.media
    }),
    (dispatch) => bindActionCreators({
      listenForCalls
    }, dispatch)
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const {
        media,
        sparkInstance
      } = nextProps;

      if (sparkInstance) {
        if (!media.status.isListening) {
          // Listen for new calls
          nextProps.listenForCalls(sparkInstance);
        }
      }
    }
  })
);
