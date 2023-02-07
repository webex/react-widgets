import React from 'react';
import { faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { CallHistory } from './CallHistory';

export default {
  title: 'Components/Call History/List',
  component: CallHistory,
} as ComponentMeta<typeof CallHistory>;

const Template: ComponentStory<typeof CallHistory> = (args) => (
  <CallHistory {...args} />
);

const mockItems = [
  {
    id: '1',
    name: faker.name.findName(),
    phoneNumber: '+16695441558',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    direction: 'INCOMING',
    disposition: 'CANCELLED',
  },
  {
    id: '2',
    name: faker.name.findName(),
    phoneNumber: '+15555555555',
    startTime: '2022-04-20T21:21:16.186Z',
    endTime: '2022-04-20T21:21:22.202Z',
    direction: 'INCOMING',
    disposition: 'MISSED',
  },
  {
    id: '3',
    name: faker.name.findName(),
    phoneNumber: '+15555555555',
    startTime: '2022-04-23T21:21:16.186Z',
    endTime: '2022-04-23T21:24:22.202Z',
    direction: 'OUTGOING',
    disposition: 'ANSWERED',
  },
  {
    id: '4',
    name: faker.name.findName(),
    phoneNumber: '+15555555555',
    startTime: '2022-04-24T21:21:16.186Z',
    endTime: '2022-04-24T21:29:32.202Z',
    direction: 'INCOMING',
    disposition: 'ANSWERED',
  },
];

export const Default = Template.bind({});
Default.args = {
  items: mockItems,
};
