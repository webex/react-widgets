import React from 'react';
import TestRenderer from 'react-test-renderer';

import { WebexCallingDataProvider } from '../WebexCallingDataProvider';
import { IAdapterContext } from '../../contexts/AdapterContext';

describe('WebexCallingDataProvider', () => {
  const adapter = {
    callHistoryAdapter: {},
    searchContactsAdapter: {},
  };

  test('matches snapshot', () => {
    const component = TestRenderer.create(
      <WebexCallingDataProvider adapter={adapter as IAdapterContext}>
        <div className="test">Test</div>
      </WebexCallingDataProvider>
    );

    expect(component.toJSON()).toMatchSnapshot();
  });
});
