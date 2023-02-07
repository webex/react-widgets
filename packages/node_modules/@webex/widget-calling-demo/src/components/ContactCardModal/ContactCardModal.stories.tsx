import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ContactCardModal } from './ContactCardModal';
import { Default as contactCard } from '../ContactCard/ContactCard.stories';

export default {
  title: 'Components/ContactCardModal',
  component: ContactCardModal,
} as ComponentMeta<typeof ContactCardModal>;

const Template: ComponentStory<typeof ContactCardModal> = (args) => (
  <ContactCardModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  ...contactCard.args,
};
