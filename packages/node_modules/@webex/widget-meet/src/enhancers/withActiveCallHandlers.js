import {compose, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {updateLocalVideoPosition} from '../actions';

function findClosestPosition(node, position) {
  const parent = node.offsetParent;
  const {x, y} = position;
  const nodeHeight = node.offsetHeight;
  const nodeWidth = node.offsetWidth;
  const parentHeight = parent.offsetHeight;
  const parentWidth = parent.offsetWidth;

  const x2 = (parentWidth - nodeWidth) / 2;
  const x3 = parentWidth - nodeWidth;
  const y2 = (parentHeight - nodeHeight) / 2;

  const snapTransform = [
    {x: -x3, y: 0}, {x: -x2, y: 0}, {x: 0, y: 0},
    {x: -x3, y: y2}, {x: 0, y: y2}
  ];

  const distances = snapTransform.map((val) => {
    const dx = x - val.x;
    const dy = y - val.y;

    return Math.sqrt(dx * dx + dy * dy);
  });

  return snapTransform[distances.indexOf(Math.min(...distances))];
}

function handleLocalVideoDragStop(props) {
  return (e, data) => {
    const {node, x, y} = data;
    const closest = findClosestPosition(node, {x, y});

    props.updateLocalVideoPosition(closest);
  };
}

function handleStartSendingAudio(props) {
  return () => props.instance.startSendingAudio();
}

function handleStartSendingVideo(props) {
  return () => props.instance.startSendingVideo();
}

function handleStopSendingAudio(props) {
  return () => props.instance.stopSendingAudio();
}

function handleStopSendingVideo(props) {
  return () => props.instance.stopSendingVideo();
}

export default compose(
  connect(
    null,
    (dispatch) => bindActionCreators({
      updateLocalVideoPosition
    }, dispatch)
  ),
  withHandlers({
    onLocalVideoDragStop: handleLocalVideoDragStop,
    onStartSendingAudio: handleStartSendingAudio,
    onStartSendingVideo: handleStartSendingVideo,
    onStopSendingAudio: handleStopSendingAudio,
    onStopSendingVideo: handleStopSendingVideo
  })
);
