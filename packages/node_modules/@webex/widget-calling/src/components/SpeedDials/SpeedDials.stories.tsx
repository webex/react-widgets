import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { SpeedDials } from './SpeedDials';
import { createSpeedDialItems } from '../../test-utils';

export default {
  title: 'Components/Speed Dials',
  component: SpeedDials,
} as ComponentMeta<typeof SpeedDials>;

const Template: ComponentStory<typeof SpeedDials> = (args) => (
  <SpeedDials {...args} />
);

const items = createSpeedDialItems(10);

export const List = Template.bind({});
List.args = {
  items,
};

export const Empty = Template.bind({});
Empty.args = {
  items: [],
};

export const Max = Template.bind({});
Max.args = {
  items: createSpeedDialItems(25),
};
