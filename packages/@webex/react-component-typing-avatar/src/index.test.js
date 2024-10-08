import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import TypingAvatar from '.';

const renderer = new ShallowRenderer();

describe('TypingAvatar container', () => {
  it('renders properly', () => {
    renderer.render(
      <TypingAvatar avatarId="spock-abc" name="Spock" />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
  it('renders properly when typing', () => {
    renderer.render(
      <TypingAvatar avatarId="spock-abc" isTyping name="Spock" />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
