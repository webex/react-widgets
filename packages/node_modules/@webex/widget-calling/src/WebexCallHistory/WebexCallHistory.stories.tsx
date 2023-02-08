import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AdapterProvider } from '../contexts/AdapterContext';
import { WebexCallHistory } from './WebexCallHistory';
import { mockAdapter } from '../test-utils/mockAdapter';

export default {
  title: 'Widgets/WebexCallHistory',
  component: WebexCallHistory,
  decorators: [
    (Story) => (
      <AdapterProvider adapter={mockAdapter}>{Story()}</AdapterProvider>
    ),
  ],
} as ComponentMeta<typeof WebexCallHistory>;

const Template: ComponentStory<typeof WebexCallHistory> = (args) => (
  <WebexCallHistory {...args} />
);

export const Default = Template.bind({});
Default.args = {
  userID: 'user1',
};

export const Empty = Template.bind({});
Empty.args = {
  userID: 'user2',
};
