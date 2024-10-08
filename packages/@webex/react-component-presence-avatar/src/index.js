import React from 'react';
import PropTypes from 'prop-types';

import {Avatar} from '@momentum-ui/react';

import {
  PRESENCE_TYPE_ACTIVE,
  PRESENCE_TYPE_INACTIVE,
  PRESENCE_TYPE_DND,
  PRESENCE_TYPE_OOO
} from '@webex/redux-module-presence';

import './momentum.scss';

const propTypes = {
  image: PropTypes.string,
  isSelfAvatar: PropTypes.bool,
  isTyping: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
    PropTypes.number
  ]),
  spaceType: PropTypes.string,
  presenceStatus: PropTypes.string
};

const defaultProps = {
  image: undefined,
  isSelfAvatar: false,
  isTyping: false,
  name: undefined,
  onClick: undefined,
  size: 40,
  spaceType: undefined,
  presenceStatus: undefined
};

function PresenceAvatar(props) {
  const {
    image,
    isSelfAvatar,
    isTyping,
    name,
    onClick,
    size,
    spaceType,
    presenceStatus
  } = props;
  let type = '';
  const color = 'white';
  const backgroundColor = 'grey';

  // Do not show presence on self avatars
  if (!isSelfAvatar) {
    switch (presenceStatus) {
      case PRESENCE_TYPE_ACTIVE:
        type = 'active';
        break;
      case PRESENCE_TYPE_INACTIVE:
        type = 'inactive';
        break;
      case PRESENCE_TYPE_OOO:
        type = 'ooo';
        break;
      case PRESENCE_TYPE_DND:
        type = 'dnd';
        break;
      default:
        type = '';
    }
    if (isTyping) {
      type = 'typing';
    }
    if (spaceType === 'group') {
      type = 'group';
    }
  }
  else {
    type = 'self';
  }

  return (
    <Avatar
      onClick={onClick}
      title={name}
      type={type}
      src={image}
      size={size}
      color={color}
      backgroundColor={backgroundColor}
    />
  );
}

PresenceAvatar.propTypes = propTypes;
PresenceAvatar.defaultProps = defaultProps;

export default PresenceAvatar;
