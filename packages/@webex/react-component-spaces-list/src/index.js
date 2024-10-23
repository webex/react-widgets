import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {AutoSizer, List} from 'react-virtualized';

import {Spinner} from '@momentum-ui/react';

import SpaceItem from '@webex/react-component-space-item';

import {getBadgeState, getGlobalNotificationState, hasMentions} from '@webex/react-component-utils';

import styles from './styles.css';
import './momentum.scss';

const propTypes = {
  activeSpaceId: PropTypes.string,
  currentUser: PropTypes.object,
  hasCalling: PropTypes.bool,
  isLoadingMore: PropTypes.bool,
  onCallClick: PropTypes.func,
  onClick: PropTypes.func,
  onScroll: PropTypes.func,
  searchTerm: PropTypes.string,
  spaces: PropTypes.arrayOf(
    PropTypes.shape({
      avatarUrl: PropTypes.string,
      activityText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
      ]),
      callStartTime: PropTypes.number,
      id: PropTypes.string,
      isDecrypting: PropTypes.bool,
      isUnread: PropTypes.bool,
      lastActivityTime: PropTypes.string,
      name: PropTypes.string,
      teamColor: PropTypes.string,
      teamName: PropTypes.string,
      type: PropTypes.string
    })
  ),
  features: PropTypes.object
};

const defaultProps = {
  activeSpaceId: '',
  currentUser: null,
  features: null,
  hasCalling: false,
  isLoadingMore: false,
  onCallClick: () => {},
  onClick: () => {},
  onScroll: () => {},
  searchTerm: '',
  spaces: []
};

export default function SpacesList({
  activeSpaceId,
  currentUser,
  features,
  hasCalling,
  isLoadingMore,
  onCallClick,
  onClick,
  onScroll,
  searchTerm,
  spaces
}) {
  function rowRenderer(options) {
    const {
      key,
      index
    } = options;
    let {style} = options;

    if (index >= spaces.length) {
      style = Object.assign({textAlign: 'center'}, style);

      return (
        <div key={key} style={style}>
          <Spinner size={20} />
        </div>
      );
    }
    const space = spaces[index];
    const hasMention = hasMentions(currentUser, space);
    const unread = space.isUnread;
    const globalNotificationState = getGlobalNotificationState(features);
    const badge = getBadgeState({
      space, unread, hasMention, globalNotificationState
    });

    return (
      <div className={classNames(`webex-spaces-list-item-${index}`)} key={key} style={style}>
        <SpaceItem
          active={space.id === activeSpaceId}
          badge={badge}
          hasCalling={hasCalling}
          key={key}
          onCallClick={onCallClick}
          onClick={onClick}
          {...space}
          searchTerm={searchTerm}
        />
      </div>
    );
  }

  const rowCount = isLoadingMore ? spaces.length + 1 : spaces.length;

  return (
    <div className={classNames('webex-spaces-list-container', styles.spacesListContainer)}>
      <AutoSizer>
        {({height, width}) => (
          <List
            className={classNames('webex-spaces-list', styles.spacesListDark)}
            height={height}
            onScroll={onScroll}
            rowCount={rowCount}
            rowHeight={52}
            rowRenderer={rowRenderer}
            width={width}
          />
        )}
      </AutoSizer>
    </div>
  );
}

SpacesList.propTypes = propTypes;
SpacesList.defaultProps = defaultProps;