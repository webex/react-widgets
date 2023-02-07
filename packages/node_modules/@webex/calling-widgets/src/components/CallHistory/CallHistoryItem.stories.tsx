import React from 'react';
import { faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { CallHistoryItem } from './CallHistoryItem';

export default {
  title: 'Components/Call History/Item',
  component: CallHistoryItem,
  argTypes: {
    direction: {
      options: ['incoming', 'outgoing'],
      control: { type: 'radio' },
    },
    disposition: {
      options: ['answered', 'missed', 'cancelled'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof CallHistoryItem>;

const Template: ComponentStory<typeof CallHistoryItem> = (args) => (
  <CallHistoryItem {...args} />
);

export const Incoming = Template.bind({});
Incoming.args = {
  id: 'item1',
  name: faker.name.findName(),
  phoneNumber: '+12345678999',
  startTime: '2022-06-20T19:00:00.000Z',
  endTime: '2022-06-20T19:05:00.000Z',
  direction: 'INCOMING',
  disposition: 'ANSWERED',
};

export const Outgoing = Template.bind({});
Outgoing.args = {
  ...Incoming.args,
  direction: 'OUTGOING',
};

export const Missed = Template.bind({});
Missed.args = {
  ...Incoming.args,
  disposition: 'MISSED',
};

export const Selected = Template.bind({});
Selected.args = {
  ...Incoming.args,
  endTime: '2022-06-20T19:05:12.000Z',
  direction: 'OUTGOING',
  isSelected: true,
};
