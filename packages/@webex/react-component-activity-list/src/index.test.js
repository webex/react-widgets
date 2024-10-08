import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import {FEATURES_WIDGET_ADAPTIVE_CARD} from '@webex/react-component-utils';

import ActivityList, {ITEM_TYPE_ACTIVITY} from '.';

const renderer = new ShallowRenderer();

describe('ActivityList component', () => {
  const activities = [{
    activity: {
      id: 'test-123-123-123-123',
      actor: {
        id: 1,
        displayName: 'Test User 1'
      },
      object: {
        displayName: 'Test Activity Content 1'
      },
      published: '2016-09-20T19:52:57.186Z',
      verb: 'post'
    },
    isAdditional: false,
    isFlagged: false,
    isFlagPending: false,
    isPending: false,
    isSelf: true,
    name: 'Test User 1',
    type: ITEM_TYPE_ACTIVITY
  }, {
    activity: {
      id: 'test-456-123-456-123',
      actor: {
        id: 2,
        displayName: 'Test User 2'
      },
      object: {
        displayName: 'Test Activity Content 2'
      },
      published: '2016-09-20T19:53:57.186Z',
      verb: 'post'
    },
    isAdditional: true,
    isFlagged: false,
    isPending: false,
    isSelf: true,
    name: 'Test User 2',
    type: ITEM_TYPE_ACTIVITY
  }, {
    activity: {
      id: 'test-789-123-789-123',
      actor: {
        id: 3,
        displayName: 'Test User 3'
      },
      object: {
        displayName: 'Test Activity Content 3'
      },
      published: '2016-09-20T19:54:57.186Z',
      verb: 'post'
    },
    isAdditional: false,
    isFlagged: true,
    isFlagPending: false,
    isPending: true,
    isSelf: false,
    name: 'Test User 3',
    type: ITEM_TYPE_ACTIVITY

  }];
  const onActivityDelete = jest.fn();
  const onActivityFlag = jest.fn();
  let features;
  let items;

  beforeEach(() => {
    features = new Map();
    items = new Map();
  });

  it('renders properly', () => {
    renderer.render(
      <ActivityList
        activities={activities}
        onActivityDelete={onActivityDelete}
        onActivityFlag={onActivityFlag}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly if feature is not set', () => {
    renderer.render(
      <ActivityList
        activities={activities}
        onActivityDelete={onActivityDelete}
        onActivityFlag={onActivityFlag}
        features={features}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly if feature is  set', () => {
    features.set('items', items.set(FEATURES_WIDGET_ADAPTIVE_CARD, true));
    renderer.render(
      <ActivityList
        activities={activities}
        onActivityDelete={onActivityDelete}
        onActivityFlag={onActivityFlag}
        features={features}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
