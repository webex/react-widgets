import React from 'react';

import ShallowRenderer from 'react-test-renderer/shallow';

import {FEATURES_WIDGET_ADAPTIVE_CARD_ON} from '@webex/react-component-utils';

import ActivityItem from './index';

const renderer = new ShallowRenderer();

describe('ActivityItem post component is self', () => {
  const activity = {
    id: 'test-123-123-123-123',
    isSelf: true,
    activity: {
      displayName: 'Test Activity Content'
    },
    onActivityDelete: jest.fn(),
    name: 'Test User',
    timestamp: '2016-09-20T19:52:57.186Z',
    verb: 'post'
  };

  it('renders properly', () => {
    renderer.render(
      <ActivityItem {...activity} />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});

describe('ActivityItem post component not self', () => {
  const activity = {
    id: 'test-123-123-123-123',
    isSelf: false,
    activity: {
      displayName: 'Test Activity Content'
    },
    name: 'Test User',
    timestamp: '2016-09-20T19:52:57.186Z',
    verb: 'post'
  };

  it('renders properly', () => {
    renderer.render(
      <ActivityItem {...activity} />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});

describe('ActivityItem post component not self with html', () => {
  const activity = {
    id: 'test-123-123-123-123',
    isSelf: false,
    activity: {
      content: '<pre>js.func();</pre>',
      displayName: 'Test Activity Content'
    },
    name: 'Test User',
    timestamp: '2016-09-20T19:52:57.186Z',
    verb: 'post'
  };

  it('renders properly', () => {
    renderer.render(
      <ActivityItem {...activity} />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});

describe('ActivityItem post component is reply', () => {
  const activity = {
    id: 'test-123-123-123-123',
    isReply: true,
    activity: {
      content: '<pre>js.func();</pre>',
      displayName: 'Test Activity Content'
    },
    name: 'Test User',
    timestamp: '2016-09-20T19:52:57.186Z',
    verb: 'post'
  };

  it('renders properly', () => {
    renderer.render(
      <ActivityItem {...activity} />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});

describe('ActivityItem tombstone component', () => {
  const activity = {
    id: 'test-123-123-123-123',
    activity: {
      displayName: 'Test Activity Content'
    },
    name: 'Test User',
    timestamp: '2016-09-20T19:52:57.186Z',
    verb: 'tombstone'
  };

  it('renders properly', () => {
    renderer.render(
      <ActivityItem {...activity} />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});

describe('ActivityItem component when message contains adaptive card', () => {
  const activity = {
    object: {
      displayName: 'Hello World!',
      displayNameHTML: {
        __html: 'Hello World!'
      },
      cards: [
        '{"type":"AdaptiveCard","version":"1.0","body":[{"type":"TextBlock","text":"Adaptive Cards","separation":"none"}]}'
      ],
      objectType: 'comment'
    },
    verb: 'post'
  };
  const shareActivity = {
    object: {
      displayName: 'Hello World!',
      displayNameHTML: {
        __html: 'Hello World!'
      },
      cards: [
        '{"type":"AdaptiveCard","version":"1.0","body":[{"type":"TextBlock","text":"Adaptive Cards","separation":"none"}]}'
      ],
      files: {
        items: ['https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwie-rD1y6DlAhVBWisKHd2QDqUQjRx6BAgBEAQ&url=%2Furl%3Fsa%3Di%26source%3Dimages%26cd%3D%26ved%3D%26url%3Dhttps%253A%252F%252Fwww.computerworld.com%252Farticle%252F3389980%252Fgoogle-shift.html%26psig%3DAOvVaw29m1uk_ZwY3eAUOW7DMMT5%26ust%3D1571308887699746&psig=AOvVaw29m1uk_ZwY3eAUOW7DMMT5&ust=1571308887699746']
      },
      objectType: 'comment'
    },
    verb: 'share'
  };
  const sdkInstance = {};
  const adaptiveCardFeatureState = FEATURES_WIDGET_ADAPTIVE_CARD_ON;
  const isAdditional = true;

  it('renders an AdaptiveCard with verb "post"', () => {
    renderer.render(
      <ActivityItem
        activity={activity.object}
        adaptiveCardFeatureState={adaptiveCardFeatureState}
        sdkInstance={sdkInstance}
        isAdditional={isAdditional}
        verb={activity.verb}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders an AdaptiveCard with verb "share"', () => {
    renderer.render(
      <ActivityItem
        activity={shareActivity.object}
        adaptiveCardFeatureState={adaptiveCardFeatureState}
        sdkInstance={sdkInstance}
        isAdditional={isAdditional}
        verb={shareActivity.verb}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});