import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ScrubbingBar } from './ScrubbingBar';

export default {
  title: 'Components/ScrubbingBar',
  component: ScrubbingBar,
} as ComponentMeta<typeof ScrubbingBar>;

const Template: ComponentStory<typeof ScrubbingBar> = (args) => (
  <ScrubbingBar {...args} />
);

export const Default = Template.bind({});
Default.args = {};
