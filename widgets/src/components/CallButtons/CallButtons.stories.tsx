import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CallButtons } from './CallButtons';

export default {
  title: 'Components/CallButtons',
  component: CallButtons,
} as ComponentMeta<typeof CallButtons>;

const Template: ComponentStory<typeof CallButtons> = (args) => (
  <CallButtons {...args} />
);

export const Default = Template.bind({});
Default.args = {
  address: '1234567',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
