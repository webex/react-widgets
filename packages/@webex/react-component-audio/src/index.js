import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  srcObject: PropTypes.object.isRequired
};

function Audio({srcObject}) {
  // Need autoPlay to start the video automagically
  if (!srcObject) {
    return null;
  }

  function getEl(el) {
    const element = el;

    if (element && srcObject) {
      element.srcObject = srcObject;
    }

    return element;
  }

  return (
    // eslint-disable-reason Cannot provide captions for streaming audio yet
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio
      autoPlay
      className={classNames(styles.audio)}
      ref={getEl}
    />
  );
}

Audio.propTypes = propTypes;

export default Audio;
