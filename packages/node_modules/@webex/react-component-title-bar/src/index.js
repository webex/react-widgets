import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PresenceAvatar from '@webex/react-container-presence-avatar';

import styles from './styles.css';


const propTypes = {
  children: PropTypes.node,
  avatarId: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string
};

const defaultProps = {
  children: undefined,
  avatarId: '',
  name: '',
  type: 'default'
};

function TitleBar({
  avatarId, children, name, type
}) {
  return (
    <div className={classNames('webex-title-bar', styles.titleBar)}>
      <div className={classNames('webex-avatar-container', styles.avatarContainer)}>
        <PresenceAvatar avatarId={avatarId} name={name} spaceType={type} size={24} />
      </div>
      <div className={classNames('webex-title-text', styles.titleText)}>
        <p><strong className={classNames('webex-title', styles.title)}>{name}</strong></p>
      </div>
      <div className={classNames('webex-title-meta', styles.titleMeta)}>
        {children}
      </div>
    </div>
  );
}

TitleBar.propTypes = propTypes;
TitleBar.defaultProps = defaultProps;

export default TitleBar;
