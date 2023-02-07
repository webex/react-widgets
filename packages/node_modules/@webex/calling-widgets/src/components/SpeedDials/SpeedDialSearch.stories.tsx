import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createMSUsers } from '../../test-utils';
import { SpeedDialSearch } from './SpeedDialSearch';

export default {
  title: 'Components/Speed Dials/Search',
  component: SpeedDialSearch,
} as ComponentMeta<typeof SpeedDialSearch>;

const Template: ComponentStory<typeof SpeedDialSearch> = (args) => (
  <SpeedDialSearch {...args} />
);

const msContacts = [...createMSUsers()];

export const Default = Template.bind({});
Default.args = {
  items: msContacts,
};
