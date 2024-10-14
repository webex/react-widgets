import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon, {ICONS} from '@webex/react-component-icon';

import styles from './styles.css';

const propTypes = {
  baseColor: PropTypes.string,
  image: PropTypes.string,
  isSelfAvatar: PropTypes.bool,
  name: PropTypes.string
};

const defaultProps = {
  baseColor: '',
  image: '',
  isSelfAvatar: false,
  name: ''
};

function Avatar({
  baseColor,
  name,
  image,
  isSelfAvatar
}) {
  let avatarClass, avatarContents;
  let backgroundStyle = {};

  const letter = name ? name.replace(/[^0-9a-z]/gi, '').substr(0, 1).toUpperCase() : undefined;

  if (isSelfAvatar) {
    avatarContents = <span className={classNames('webex-avatar-self', styles.avatarSelf)}><Icon color="#04c9ef" type={ICONS.ICON_TYPE_MESSAGE} /></span>;
  }
  else if (image) {
    backgroundStyle = {backgroundImage: `url('${image}')`};
  }
  else if (baseColor) {
    backgroundStyle.backgroundColor = baseColor;
    avatarClass = [styles.avatarColorLetter, styles.avatarLetter];
    avatarContents = <span>{letter}</span>;
  }
  else if (name) {
    avatarClass = styles.avatarLetter;
    avatarContents = <span>{letter}</span>;
  }

  return (
    <div className={classNames('webex-avatar', styles.avatar, avatarClass)} style={backgroundStyle}>
      {avatarContents}
    </div>
  );
}

Avatar.propTypes = propTypes;
Avatar.defaultProps = defaultProps;

export default Avatar;
