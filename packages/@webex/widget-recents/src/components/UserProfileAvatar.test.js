import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import UserProfileAvatar from './UserProfileAvatar';

const renderer = new ShallowRenderer();

let props, component;

describe('UserProfileAvatar component', () => {
  beforeEach(() => {
    props = {
      currentUserWithAvatar: {
        id: 'my-id',
        displayName: 'Snapshot User',
        email: 'email',
        img: 'img'
      },
      enableUserProfileMenu: false,
      onSignOutClick: jest.fn(),
      onProfileClick: jest.fn()
    };
  });

  it('renders correctly without user profile menu', () => {
    renderer.render(
      <UserProfileAvatar {...props} />
    );

    component = renderer.getRenderOutput();
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with user profile menu', () => {
    props.enableUserProfileMenu = true;
    renderer.render(
      <UserProfileAvatar {...props} />
    );

    component = renderer.getRenderOutput();
    expect(component).toMatchSnapshot();
  });

  afterEach(() => {
    props = null;
  });
});
