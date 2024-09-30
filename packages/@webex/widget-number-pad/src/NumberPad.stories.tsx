import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { NumberPad } from './NumberPad';

export default {
  title: 'Components/NumberPad',
  component: NumberPad,
} as ComponentMeta<typeof NumberPad>;

const Template: ComponentStory<typeof NumberPad> = (args) => (
  <NumberPad {...args} />
);

export const Default = Template.bind({});
Default.args = {};
