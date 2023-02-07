import React from 'react';
import TestRenderer from 'react-test-renderer';

import { CallHistory } from '../CallHistory';

const items = [
  {
    id: 'item1',
    name: 'Item 1',
    phoneNumber: '+16695441558',
    startTime: '2022-04-19T21:21:16.186Z',
    endTime: '2022-04-19T21:22:16.202Z',
    direction: 'INCOMING',
    disposition: 'CANCELLED',
  },
  {
    id: 'item2',
    name: 'Item 2',
    phoneNumber: '+15555555555',
    startTime: '2022-04-20T21:21:16.186Z',
    endTime: '2022-04-20T21:21:22.202Z',
    direction: 'OUTGOING',
    disposition: 'MISSED',
  },
];

describe('CallHistory', () => {
  test('should match snapshot', () => {
    const component = TestRenderer.create(<CallHistory items={items} />);

    expect(component.toJSON()).toMatchSnapshot();
  });
});
