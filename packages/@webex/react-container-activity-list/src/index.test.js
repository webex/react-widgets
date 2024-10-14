import React from 'react';
import {Provider} from 'react-redux';
import {createComponentWithIntl} from '@webex/react-test-utils';

import store from './__fixtures__/mock-store';

import threadStore from './__fixtures__/mock-store-with-threads';

import ActivityList from '.';

describe('ActivityList', () => {
  const onActivityDelete = jest.fn();
  const onActivityFlag = jest.fn();

  it('renders properly', () => {
    const component = createComponentWithIntl(
      <Provider store={store}>
        <ActivityList
          onActivityDelete={onActivityDelete}
          onActivityFlag={onActivityFlag}
        />
      </Provider>
    );

    expect(component).toMatchSnapshot();
  });

  it('renders threads properly', () => {
    const component = createComponentWithIntl(
      <Provider store={threadStore}>
        <ActivityList
          onActivityDelete={onActivityDelete}
          onActivityFlag={onActivityFlag}
        />
      </Provider>
    );

    expect(component).toMatchSnapshot();
  });
});
