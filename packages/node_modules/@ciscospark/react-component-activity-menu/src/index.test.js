import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ActivityMenu from '.';

const renderer = new ShallowRenderer();

describe('ActivityMenu component', () => {
  const onExit = jest.fn();
  const buttons = [
    {
      label: 'Message',
      buttonType: 'chat',
      onClick: jest.fn()
    },
    {
      label: 'Call',
      buttonType: 'camera',
      onClick: jest.fn()
    }
  ];

  it('renders properly', () => {
    renderer.render(<ActivityMenu
      buttons={buttons}
      onExit={onExit}
      showExitButton
    />);
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
