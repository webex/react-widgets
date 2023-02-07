import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AdapterProvider } from '../contexts/AdapterContext';
import { WebexVoicemail } from './WebexVoicemail';
import { SDKJSONAdapter } from '../adapters/JSONAdapters';
import { createVoicemailItems } from '../test-utils';

const mockVoicemailAdapter = new SDKJSONAdapter({
  voicemails: createVoicemailItems({ count: 12 }),
});

export default {
  title: 'Widgets/WebexVoicemail',
  component: WebexVoicemail,
  decorators: [
    (Story) => (
      <AdapterProvider adapter={mockVoicemailAdapter}>
        {Story()}
      </AdapterProvider>
    ),
  ],
} as ComponentMeta<typeof WebexVoicemail>;

const Template: ComponentStory<typeof WebexVoicemail> = (args) => (
  <WebexVoicemail {...args} />
);

export const Default = Template.bind({});
Default.args = {};
