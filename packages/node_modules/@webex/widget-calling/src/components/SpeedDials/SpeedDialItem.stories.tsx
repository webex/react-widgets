import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SpeedDialItem } from './SpeedDialItem';
import { createSpeedDialItems } from '../../test-utils';

export default {
  title: 'Components/Speed Dials/Item',
  component: SpeedDialItem,
} as ComponentMeta<typeof SpeedDialItem>;

const Template: ComponentStory<typeof SpeedDialItem> = (args) => (
  <SpeedDialItem {...args} />
);

const [item] = createSpeedDialItems(1);

export const Default = Template.bind({});
Default.args = {
  item,
};

export const WithImage = Template.bind({});
WithImage.args = {
  ...Default.args,
};

export const Selected = Template.bind({});
Selected.args = {
  ...Default.args,
};
