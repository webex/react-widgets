// @ts-nocheck
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { WebexSpeedDials } from './WebexSpeedDials';
import { AdapterProvider } from '../contexts/AdapterContext';
import { mockAdapter } from '../test-utils/mockAdapter';
import { createMSUsers } from '../test-utils';

export default {
  title: 'Widgets/WebexSpeedDials',
  component: WebexSpeedDials,
  decorators: [
    (Story) => (
      <AdapterProvider adapter={mockAdapter}>{Story()}</AdapterProvider>
    ),
  ],
} as ComponentMeta<typeof WebexSpeedDials>;

const Template: ComponentStory<typeof WebexSpeedDials> = (args) => (
  <WebexSpeedDials {...args} />
);

const contacts = [...createMSUsers()];

export const Default = Template.bind({});
Default.args = {
  userID: 'user1',
  contacts,
};

export const Empty = Template.bind({});
Empty.args = {
  userID: 'userx',
};
