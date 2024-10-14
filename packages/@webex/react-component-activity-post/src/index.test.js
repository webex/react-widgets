import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ActivityPost from '.';

const renderer = new ShallowRenderer();

describe('ActivityPost post component', () => {
  const activity = {
    id: 'test-123-123-123-123',
    isSelf: true,
    displayName: 'Test Activity Content',
    name: 'Test User',
    timestamp: '2016-09-20T19:52:57.186Z',
    verb: 'post'
  };

  const adaptiveCardActivity = {
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

  it('renders properly', () => {
    renderer.render(
      <ActivityPost {...activity} />
    );

    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly with adaptiveCard', () => {
    renderer.render(
      <ActivityPost
        renderAdaptiveCard
        cards={adaptiveCardActivity.cards}
        displayName={adaptiveCardActivity.object.displayName}
      />
    );

    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
