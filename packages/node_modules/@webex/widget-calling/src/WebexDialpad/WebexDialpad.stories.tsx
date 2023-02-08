import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WebexDialpad } from './WebexDialpad';
import { mockSearchContactsAdapter } from '../WebexSearchContacts/WebexSearchContacts.stories';
import { AdapterProvider } from '../contexts/AdapterContext';

export default {
  title: 'Widgets/WebexDialpad',
  component: WebexDialpad,
  decorators: [
    (Story) => (
      <AdapterProvider adapter={mockSearchContactsAdapter}>
        {Story()}
      </AdapterProvider>
    ),
  ],
} as ComponentMeta<typeof WebexDialpad>;

const Template: ComponentStory<typeof WebexDialpad> = () => <WebexDialpad />;

export const Default = Template.bind({});
Default.args = {};
