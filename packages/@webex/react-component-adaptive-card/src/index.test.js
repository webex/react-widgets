
import React from 'react';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore
} from 'redux';
import conversation from '@webex/redux-module-conversation';


import AdaptiveCard from '.';

describe('Adaptive Card Component', () => {
  const adaptiveCardActivity = {
    actor: {
      fullName: 'Some Bot',
      displayName: 'Some Bot',
      emailAddress: 'some-bot@webex.bot',
      id: '53e63861-c0af-4643-96d3-8dde5c19149b',
      objectType: 'person',
      isBot: true
    },
    clientTempId: 'web-client-temp-id1409086527563',
    id: '4df9b460-2d63-11e4-b8eb-ee17142ef128',
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
    objectType: 'activity',
    published: '2014-08-26T20:55:26.118Z',
    target: {
      activities: {},
      id: '4d7912b0-2d63-11e4-9b70-a20f8d5fb2fd',
      objectType: 'conversation',
      participants: {},
      tags: [],
      url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/4d7912b0-2d63-11e4-9b70-a20f8d5fb2fd'
    },
    url: 'https://conv-a.wbx2.com/conversation/api/v1/activities/4df9b460-2d63-11e4-b8eb-ee17142ef128',
    verb: 'post'
  };
  const store = createStore(
    combineReducers({
      conversation
    }),
    compose([
      applyMiddleware(thunk)
    ])
  );

  it('renders properly', () => {
    const component = (
      <Provider store={store}>
        <AdaptiveCard
          cards={adaptiveCardActivity.object.cards}
          displayName={adaptiveCardActivity.object.displayName}
        />
      </Provider>);

    expect(component).toMatchSnapshot();
  });
});
