import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SpeedDialModal } from './SpeedDialModal';

export default {
  title: 'Components/Speed Dials/Modal',
  component: SpeedDialModal,
} as ComponentMeta<typeof SpeedDialModal>;

const Template: ComponentStory<typeof SpeedDialModal> = (args) => (
  <SpeedDialModal {...args} />
);

export const Default = Template.bind({});
Default.args = {};
