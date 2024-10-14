// @ts-nocheck
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { GenericModal } from './GenericModal';

export default {
  title: 'Components/GenericModal',
  component: GenericModal,
} as ComponentMeta<typeof GenericModal>;

const Template: ComponentStory<typeof GenericModal> = (args) => (
  <GenericModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  isOpen: false,
};

export const WithContent = (args) => (
  <Template {...args}>
    <p>Content</p>
  </Template>
);
