import { faker } from '@faker-js/faker';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { IWebexIntContact } from '@webex/component-adapter-interfaces/dist/esm/src';
import { ContactCard } from './ContactCard';

/**
 *
 */
function createMockItem(): IWebexIntContact {
  const name = faker.name.findName();
  return {
    id: faker.datatype.uuid(),
    name,
    phoneNumbers: [
      {
        type: 'home',
        address: faker.phone.number('+1-###-###-####'),
      },
      {
        type: 'work',
        address: faker.phone.number('+1-###-###-####'),
      },
    ],
    emailAddresses: [
      {
        type: 'email',
        address: faker.internet.email(name),
      },
    ],
  };
}

export default {
  title: 'Components/ContactCard',
  component: ContactCard,
} as ComponentMeta<typeof ContactCard>;

const Template: ComponentStory<typeof ContactCard> = (args) => (
  <ContactCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
  user: createMockItem(),
};

export const OneAddress = Template.bind({});
const onAddressUser = createMockItem();
onAddressUser.phoneNumbers = [];
OneAddress.args = {
  user: onAddressUser,
};

export const NoAddresses = Template.bind({});
const noAddressUser = createMockItem();
noAddressUser.phoneNumbers = [];
noAddressUser.emailAddresses = [];
NoAddresses.args = {
  user: noAddressUser,
};
