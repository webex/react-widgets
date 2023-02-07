import React from 'react';
import { render } from '@testing-library/react';
import { WebexCallHistory } from '../WebexCallHistory';
import { SDKJSONAdapter } from '../../adapters/JSONAdapters';
import { AdapterProvider } from '../../contexts/AdapterContext';
import { createCallHistoryItems } from '../../test-utils';

const mockedDate = new Date(Date.UTC(2017, 7, 9, 8));
const mockDatasource = {
  'user1-callHistory': createCallHistoryItems({ count: 3, date: mockedDate }),
};
Date.now = jest.fn(() => mockedDate.valueOf());

const mockAdapter = new SDKJSONAdapter({ callHistory: mockDatasource });
// mockAdapter.callHistoryAdapter.refresh = jest.fn();

describe('WebexCallHistory', () => {
  test('should render with call history items', () => {
    const { asFragment } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexCallHistory userID="user1" />
      </AdapterProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render with empty items', () => {
    const { asFragment } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexCallHistory userID="user2" />
      </AdapterProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
