import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { faker } from '@faker-js/faker';

import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import { AdapterProvider } from '../contexts/AdapterContext';
import {
  SDKJSONAdapter,
  SearchContactsJSONAdapterDataSource,
} from '../adapters/JSONAdapters';
import { WebexSearchContacts } from './WebexSearchContacts';

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
        type: 'Mobile',
        address: faker.phone.number('+1-###-###-####'),
      },
      {
        type: 'Home',
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

const directoryItems50 = new Array(50).fill({}).map(() => {
  return createMockItem();
});

const contactItems50 = new Array(50).fill({}).map(() => {
  return createMockItem();
});

export const mockSearchContactsDatasource: SearchContactsJSONAdapterDataSource =
  {
    directory: directoryItems50,
    contacts: contactItems50,
  };
export const mockSearchContactsAdapter = new SDKJSONAdapter({
  contacts: mockSearchContactsDatasource,
});

export default {
  title: 'Widgets/WebexSearchContacts',
  component: WebexSearchContacts,
  decorators: [
    (Story) => (
      <AdapterProvider adapter={mockSearchContactsAdapter}>
        {Story()}
      </AdapterProvider>
    ),
  ],
  excludeStories: ['mockSearchContactsAdapter', 'mockSearchContactsDatasource'],
} as ComponentMeta<typeof WebexSearchContacts>;

const Template: ComponentStory<typeof WebexSearchContacts> = (args) => (
  <WebexSearchContacts {...args} />
);

export const Default = Template.bind({});
Default.args = {};
