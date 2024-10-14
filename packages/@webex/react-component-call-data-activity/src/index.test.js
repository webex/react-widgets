import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import CallDataActivityMessage from '.';

const renderer = new ShallowRenderer();

describe('CallDataActivityMessage component', () => {
  let actor, currentUser, duration, isGroupCall, participants;

  beforeEach(() => {
    actor = {
      entryUUID: 'abc-123'
    };
    duration = 6;
    isGroupCall = false;
    participants = [
      {
        person: {
          entryUUID: 'abc-123'
        },
        isInitiator: true,
        state: 'LEFT'
      },
      {
        person: {
          entryUUID: 'def-456'
        },
        isInitiator: false,
        state: 'LEFT'
      }
    ];
    currentUser = {
      id: 'abc-123'
    };
  });


  it('renders properly for having a call', () => {
    renderer.render(
      <CallDataActivityMessage
        actor={actor}
        duration={duration}
        isGroupCall={isGroupCall}
        participants={participants}
        currentUser={currentUser}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly for having a meeting', () => {
    isGroupCall = true;
    renderer.render(
      <CallDataActivityMessage
        actor={actor}
        duration={duration}
        isGroupCall={isGroupCall}
        participants={participants}
        currentUser={currentUser}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
