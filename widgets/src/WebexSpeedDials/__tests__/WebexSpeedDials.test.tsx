import React from 'react';
import { render } from '@testing-library/react';

import { AdapterProvider } from '../../contexts/AdapterContext';
import { mockAdapter } from '../../test-utils/mockAdapter';
import { WebexSpeedDials } from '../WebexSpeedDials';

const mockedDate = new Date(Date.UTC(2017, 7, 9, 8));
Date.now = jest.fn(() => mockedDate.valueOf());

describe('WebexSpeedDials', () => {
  test('should render with call history items', () => {
    const { asFragment } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSpeedDials userID="user1" />
      </AdapterProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('should render with empty items', () => {
    const { asFragment } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSpeedDials userID="user2" />
      </AdapterProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
