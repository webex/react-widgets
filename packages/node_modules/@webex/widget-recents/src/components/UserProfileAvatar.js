import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Avatar, MenuContent, Menu, MenuItem, MenuOverlay} from '@momentum-ui/react';

import PresenceAvatar from '@webex/react-container-presence-avatar';

import styles from './UserProfileAvatar.css';


const propTypes = {
  currentUserWithAvatar: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    img: PropTypes.string
  }).isRequired,
  enableUserProfileMenu: PropTypes.bool.isRequired,
  onSignOutClick: PropTypes.func,
  onProfileClick: PropTypes.func
};

const defaultProps = {
  onSignOutClick: () => {},
  onProfileClick: () => {}
};

function ProfileAvatarMenu(props) {
  const {
    currentUserWithAvatar,
    enableUserProfileMenu,
    onProfileClick,
    onSignOutClick
  } = props;
  const presenceAvatar = (
    <PresenceAvatar
      avatarId={currentUserWithAvatar.id}
      name={currentUserWithAvatar.displayName}
      onClick={onProfileClick}
    />);
  const menu = (
    <MenuOverlay
      direction="bottom-left"
      menuTrigger={presenceAvatar}
      targetOffset={{vertical: 4}}
    >
      <MenuContent>
        <div className={classNames('webex-recents-header-profile-menu', styles.menu)}>
          <Avatar
            src={currentUserWithAvatar.img}
            title={currentUserWithAvatar.displayName}
            size={84}
          />
          <div className={classNames('webex-recents-header-profile-menu-info', styles.info)}>
            <h4>{currentUserWithAvatar.displayName} </h4>
            <h5>{currentUserWithAvatar.email}</h5>
          </div>
        </div>
      </MenuContent>
      <Menu>
        <MenuItem
          className={classNames('webex-recents-header-profile-menu-signout', styles.signout)}
          onClick={onSignOutClick}
          label="Sign Out"
        />
      </Menu>
    </MenuOverlay>
  );

  return enableUserProfileMenu ? menu : presenceAvatar;
}


ProfileAvatarMenu.propTypes = propTypes;
ProfileAvatarMenu.defaultProps = defaultProps;

export default ProfileAvatarMenu;
