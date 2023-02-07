import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import { AdapterProvider } from '../../../contexts/AdapterContext';
import { ContactCard } from '../ContactCard';
import { createWebexIntUsers } from '../../../test-utils';
import { SDKJSONAdapter } from '../../../adapters/JSONAdapters';

const user = createWebexIntUsers({
  count: 1,
  minPhoneNumbers: 2,
  minEmailAddresses: 1,
})[0];

describe('ContactCard', () => {
  test('renders', async () => {
    const { asFragment } = render(<ContactCard user={user} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders user with 1 callable', async () => {
    const userWithOneAddress: IWebexIntContact = createWebexIntUsers({
      count: 1,
      minPhoneNumbers: 1,
      maxPhoneNumbers: 1,
      maxEmailAddresses: 0,
    })[0];
    const { asFragment } = render(<ContactCard user={userWithOneAddress} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders user with 0 callable', async () => {
    const userWithNoAddress = createWebexIntUsers({
      count: 1,
      maxPhoneNumbers: 0,
      maxEmailAddresses: 0,
    })[0];
    const { asFragment } = render(<ContactCard user={userWithNoAddress} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('calls onSelect on selection change', async () => {
    const mockAdapter = new SDKJSONAdapter({});
    const spy = jest.spyOn(mockAdapter.makeCallAdapter, 'makeCall');

    const { getByLabelText, getByTitle } = render(
      <AdapterProvider adapter={mockAdapter}>
        <ContactCard user={user} />
      </AdapterProvider>
    );
    const select = getByLabelText('select address to call');
    fireEvent.click(select);
    const userNumberToClick = `${user.phoneNumbers[1].type}: ${user.phoneNumbers[1].address}`;
    fireEvent.click(getByTitle(userNumberToClick));
    const audioCallButton = getByLabelText('makeAudioCallTo');
    const audioVideoButton = getByLabelText('makeVideoCallTo');
    fireEvent.click(audioCallButton);
    expect(spy).toHaveBeenCalledWith(user.phoneNumbers[1].address, false);
    fireEvent.click(audioVideoButton);
    expect(spy).toHaveBeenCalledWith(user.phoneNumbers[1].address, true);
  });
});
