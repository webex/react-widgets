import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PresenceAvatar from '@webex/react-container-presence-avatar';

import {Button, Icon, ListItem, ListItemSection, Popover} from '@momentum-ui/react';

import styles from './list-item.css';


const propTypes = {
  canEdit: PropTypes.bool,
  displayName: PropTypes.string,
  emailAddress: PropTypes.string,
  id: PropTypes.string,
  isExternal: PropTypes.bool,
  isPending: PropTypes.bool,
  onClick: PropTypes.func,
  onRemove: PropTypes.func
};

const defaultProps = {
  canEdit: false,
  emailAddress: '',
  id: '',
  displayName: '',
  isExternal: false,
  isPending: false,
  onClick: () => {},
  onRemove: () => {}
};

function Person({
  canEdit,
  displayName,
  emailAddress,
  id,
  isExternal,
  isPending,
  onClick,
  onRemove
}) {
  function handleAction() {
    if (!isPending) {
      onClick();
    }
  }

  function handleRemove() {
    if (!isPending) {
      onRemove();
    }
  }

  const detailName = emailAddress.length ? `${displayName} (${emailAddress})` : `${displayName}`;

  const popoverContent = (
    <span
      className={classNames(
        'webex-people-list-item-popover',
        styles.popover
      )}
    >
      <Button
        ariaLabel="Remove from space"
        onClick={handleRemove}
        removeStyle
      >
        Remove from space
      </Button>
    </span>
  );

  return (
    <div
      className={classNames(
        'webex-people-list-item',
        styles.item,
        {
          [styles.external]: isExternal,
          'webex-people-list-item-external': isExternal,
          [styles.pending]: isPending,
          'webex-people-list-item-pending': isPending
        }
      )}
      title={detailName}
    >
      <ListItem onClick={handleAction} title={displayName} type="small">
        <ListItemSection position="left">
          <div className={classNames('webex-people-list-avatar', styles.avatar)}>
            <PresenceAvatar avatarId={id} name={displayName} size={28} />
          </div>
        </ListItemSection>
        <ListItemSection position="center">
          <div className={classNames('webex-people-list-name', styles.name)}>
            {displayName}
          </div>
        </ListItemSection>
        <ListItemSection position="right">
          { canEdit &&
            <div className={classNames('webex-people-list-more', styles.moreButton)}>
              <Popover
                closeOnClick
                content={popoverContent}
                delay={0}
                direction="bottom-right"
                doesAnchorToggle
                hideDelay={0}
                hoverDelay={500}
                isContained
                popoverTrigger="Click"
              >
                <Button
                  ariaLabel="More Details"
                  circle
                >
                  <Icon name="icon-more_20" />
                </Button>
              </Popover>
            </div>
          }
        </ListItemSection>
      </ListItem>
    </div>
  );
}

Person.propTypes = propTypes;
Person.defaultProps = defaultProps;

export default Person;
