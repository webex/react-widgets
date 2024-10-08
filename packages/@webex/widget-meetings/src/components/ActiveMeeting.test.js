import React from 'react';

import ShallowRenderer from 'react-test-renderer/shallow';

import ActiveMeeting from './ActiveMeeting';

const renderer = new ShallowRenderer();

describe('ActiveMeeting component', () => {
  it('renders properly with all props', () => {
    renderer.render(
      <ActiveMeeting
        localVideoStream={{localVideoStream: 'mock'}}
        onLeaveClick={jest.fn()}
        remoteVideoStream={{removeVideoStream: 'mock', active: true}}
      />
    );

    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly with inactive remote video', () => {
    renderer.render(
      <ActiveMeeting
        localVideoStream={{localVideoStream: 'mock'}}
        onLeaveClick={jest.fn()}
        remoteVideoStream={{removeVideoStream: 'mock', active: false}}
      />
    );

    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly with no remote video', () => {
    renderer.render(
      <ActiveMeeting
        localVideoStream={{localVideoStream: 'mock'}}
        onLeaveClick={jest.fn()}
      />
    );

    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly with no local video', () => {
    renderer.render(
      <ActiveMeeting
        onLeaveClick={jest.fn()}
        remoteVideoStream={{removeVideoStream: 'mock', active: false}}
      />
    );

    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});

