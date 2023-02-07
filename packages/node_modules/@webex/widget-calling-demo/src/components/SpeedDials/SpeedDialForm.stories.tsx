import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { faker } from '@faker-js/faker';
import { SpeedDialForm } from './SpeedDialForm';
import { createMSUsers } from '../../test-utils';
import { SpeedDialPhotoInput } from './SpeedDialPhotoInput';

export default {
  title: 'Components/Speed Dials/Form',
  component: SpeedDialForm,
} as ComponentMeta<typeof SpeedDialForm>;

const Template: ComponentStory<typeof SpeedDialForm> = (args) => (
  <SpeedDialForm {...args} />
);

// ? not in use?
// const items = [
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
//   {
//     name: faker.name.findName(),
//     number: faker.phone.number(),
//     status: 'Offline',
//   },
// ];

const users = createMSUsers();
const user = users[0];

export const Default = Template.bind({});
Default.args = {};

/**
 * Fetch user by ID and response is
 *
 * {
 * "@odata.context":"https://graph.microsoft.com/v1.0/$metadata#users/$entity",
 * "businessPhones":[],
 * "displayName":"Karen Adams",
 * "givenName":"Karen",
 * "jobTitle":null,
 * "mail":"kadams@webexinteg.onmicrosoft.com",
 * "mobilePhone":null,
 * "officeLocation":null,
 * "preferredLanguage":"en-US",
 * "surname":"Adams",
 * "userPrincipalName":"kadams@webexinteg.onmicrosoft.com",
 * "id":"aa8d69ac-0b34-450a-9b44-4834e2de0f48"
 * }
 */

/*

Existing Contact Numbers Select

Work: 555-555-5555
Mobile: 1-555-555-5555
Mail: test@gmail.com
 */

/**
 Extensions Response:
 [
 {"displayName":"David","currentCallAddress":"555-555-5555"},
 {"displayName":"John","currentCallAddress":"555-555-5555"},
 {"contactId":"5cf8c96c-d0b3-4090-85a9-63daa55cd1ab","addressType":"work"},
 {"contactId":"aa8d69ac-0b34-450a-9b44-4834e2de0f48","addressType":"mail"}
 ]
 */

/**
 {
 "id":"aa8d69ac-0b34-450a-9b44-4834e2de0f48",
 "displayName":"Karen Adams",
 "mobilePhone":null,
 "mail":"kadams@webexinteg.onmicrosoft.com",
 "businessPhones":[]
 }
 url("blob:https://jabber-integration-intb.ciscospark.com/76175925-d585-47fd-8e04-a2529ced52ef")
 */
export const AddExistingContact = Template.bind({});
AddExistingContact.args = {
  data: {
    ...user,
    photo: faker.image.avatar(),
    callType: 'handset',
  },
  isContact: true,
};

export const AddCustomContact = Template.bind({});
AddCustomContact.args = {
  isContact: false,
};

export const EditSpeedDial = Template.bind({});
EditSpeedDial.args = {
  data: {
    ...user,
    phoneType: 'mail',
    callType: 'video',
    photo: faker.image.avatar(),
    currentCallAddress: user.mobilePhone,
  },
};

export const ImageInput = () => <SpeedDialPhotoInput name="inputInput" />;
