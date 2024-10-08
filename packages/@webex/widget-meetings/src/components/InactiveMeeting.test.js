import React from 'react';

import ShallowRenderer from 'react-test-renderer/shallow';

import InactiveMeeting from './InactiveMeeting';

const renderer = new ShallowRenderer();

describe('InactiveMeeting component', () => {
  it('renders properly with all props', () => {
    renderer.render(
      <InactiveMeeting
        avatarId="avatarId"
        avatarImage="http://newurl/pic.png"
        onJoinClick={jest.fn()}
        joinButtonAriaLabel="Join Meeting"
        joinButtonLabel="Join"
        displayName="Display Name"
      />
    );

    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});

