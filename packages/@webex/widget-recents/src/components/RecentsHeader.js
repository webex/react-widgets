import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Button, Icon, InputSearch} from '@momentum-ui/react';

import UserProfileAvatar from './UserProfileAvatar';
import styles from './RecentsHeader.css';

const propTypes = {
  currentUserWithAvatar: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    img: PropTypes.string
  }).isRequired,
  enableAddButton: PropTypes.bool.isRequired,
  enableSpaceListFilter: PropTypes.bool.isRequired,
  enableUserProfile: PropTypes.bool.isRequired,
  enableUserProfileMenu: PropTypes.bool.isRequired,
  hideBottomBorder: PropTypes.bool.isRequired,
  onAddClick: PropTypes.func,
  onFilterChange: PropTypes.func,
  onProfileClick: PropTypes.func,
  onSignOutClick: PropTypes.func
};

const defaultProps = {
  onAddClick: () => {},
  onProfileClick: () => {},
  onFilterChange: () => {},
  onSignOutClick: () => {}
};

function RecentsHeader(props) {
  const {
    currentUserWithAvatar,
    enableAddButton,
    enableUserProfile,
    enableUserProfileMenu,
    enableSpaceListFilter,
    hideBottomBorder,
    onAddClick,
    onFilterChange,
    onProfileClick,
    onSignOutClick
  } = props;

  return (
    <div className={classNames('webex-recents-header', styles.recentsHeader, 'md--dark', hideBottomBorder ? '' : styles.bottomBorder)}>
      <div className={classNames('webex-recents-header-left', styles.headerSideItem)}>
        {
          enableUserProfile &&
          <UserProfileAvatar
            currentUserWithAvatar={currentUserWithAvatar}
            enableUserProfileMenu={enableUserProfileMenu}
            onProfileClick={onProfileClick}
            onSignOutClick={onSignOutClick}
          />
        }
      </div>
      <div className={classNames('webex-search-input-wrapper', styles.searchInputWrapper)}>
        {
          enableSpaceListFilter &&
          <div className={classNames('webex-search-input', styles.searchInput)}>
            <InputSearch
              name="pillSearchInput"
              htmlId="pillSearchInput"
              type="pill"
              onKeyUp={onFilterChange}
              onChange={onFilterChange}
              clear
            />
          </div>
        }
      </div>
      <div className={classNames('webex-recents-header-right', styles.headerSideItem)}>
        {
          enableAddButton &&
          <Button
            ariaLabel="Contact a person or create a space"
            onClick={onAddClick}
            circle
            color="white"
            size={40}
            title="Contact a person or create a space"
          >
            <Icon
              name="plus_18"
            />
          </Button>
        }
      </div>
    </div>
  );
}

RecentsHeader.propTypes = propTypes;
RecentsHeader.defaultProps = defaultProps;

export default RecentsHeader;