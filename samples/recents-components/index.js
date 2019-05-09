import React from 'react';

import JoinCallButton from '@ciscospark/react-component-join-call-button';
import SpaceItem from '@webex/react-component-space-item';
import SpacesList from '@webex/react-component-spaces-list';

import ListSpeed from './ListSpeed';

function RecentsComponents() {
  function onCallClick(id) {
    // eslint-disable-next-line no-alert
    window.alert(`onCallClick: ${id}`);
  }

  function onClick(id) {
    // eslint-disable-next-line no-alert
    window.alert(`onClick: ${id}`);
  }

  function onJoinClick() {
    // eslint-disable-next-line no-alert
    window.alert('onJoinClick');
  }

  const currentUser = {
    id: 'abc-123'
  };

  const spacesListSpaces = [
    {
      id: 'decrypting-space',
      isDecrypting: true,
      name: 'Webex User'
    },
    {
      activityText: 'Hey there!',
      callStartTime: Date.now(),
      id: 'jane-doe-space',
      lastActivityTime: '9:05 PM',
      latestActivity: {
        actorName: 'Jane Doe',
        type: 'post'
      },
      isUnread: true,
      name: 'Webex User',
      teamColor: 'blue',
      teamName: 'Best Team'
    }
  ];

  return (
    <div style={{backgroundColor: 'black'}}>
      <h3>JoinCallButton</h3>
      <JoinCallButton
        callStartTime={Date.now()}
        onJoinClick={onJoinClick}
      />
      <h3>SpaceItem</h3>
      <SpaceItem
        currentUser={currentUser}
        formatMessage={(a) => a}
        id="decrypting-space"
        isDecrypting
        name="isDecrypting"
        onClick={onClick}
      />
      <SpaceItem
        activityText="Hi there!"
        currentUser={currentUser}
        formatMessage={(a) => a}
        id="jane-doe-space"
        lastActivityTime="9:05 PM"
        latestActivity={{
          actorName: 'Jane Doe',
          type: 'post'
        }}
        isUnread
        hasCalling
        onCallClick={onCallClick}
        onClick={onClick}
        name="Webex User"
        teamColor="blue"
        teamName="Best Team"
      />
      <SpaceItem
        activityText="Calling!"
        callStartTime={Date.now()}
        currentUser={currentUser}
        formatMessage={(a) => a}
        id="jane-doe-space"
        lastActivityTime="9:05 PM"
        latestActivity={{
          actorName: 'Jane Doe',
          type: 'post'
        }}
        isUnread
        hasCalling
        onCallClick={onCallClick}
        onClick={onClick}
        name="Webex User"
        teamColor="blue"
        teamName="Best Team"
      />
      <SpaceItem
        activityText="I'm an active space!"
        currentUser={currentUser}
        formatMessage={(a) => a}
        id="active-space-id"
        lastActivityTime="8:02 AM"
        latestActivity={{
          actorName: 'Andrew',
          type: 'post'
        }}
        active
        onCallClick={onCallClick}
        onClick={onClick}
        name="Webex Teams"
        teamColor="green"
        teamName="Web Team"
      />
      <h3>SpaceList</h3>
      <b>With Calling</b>
      <SpacesList
        hasCalling
        height={200}
        onCallClick={onCallClick}
        onClick={onClick}
        spaces={spacesListSpaces}
      />
      <b>Without Calling</b>
      <SpacesList
        height={200}
        onCallClick={onCallClick}
        onClick={onClick}
        spaces={spacesListSpaces}
      />
      <h3>Large List Data</h3>
      <ListSpeed />
    </div>
  );
}

export default RecentsComponents;
