import React from 'react';

import ShallowRenderer from 'react-test-renderer/shallow';

import IncomingCall from '.';

describe('IncomingCall component', () => {
  const renderer = new ShallowRenderer();
  const props = {
    avatarId: 'spock-abc',
    name: 'Test User'
  };

  const component = renderer.render(
    <IncomingCall
      answerButtonLabel="Answer"
      declineButtonLabel="Decline"
      displayName="Incoming Caller"
      onAnswerClick={jest.fn()}
      onDeclineClick={jest.fn()}
      {...props}
    />
  );

  it('renders properly', () => {
    expect(component).toMatchSnapshot();
  });
});
