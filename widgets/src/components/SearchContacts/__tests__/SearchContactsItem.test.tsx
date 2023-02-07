import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { AdapterContext } from '../../../contexts/AdapterContext';
import { SearchContactsItem } from '../SearchContactsItem';
import { createWebexIntUser } from '../../../test-utils';
import { SDKJSONAdapter } from '../../../adapters/JSONAdapters';

const mockAdapter = new SDKJSONAdapter({});

describe('SearchContactsItem', () => {
  const userWithMultiple = createWebexIntUser({
    minPhoneNumbers: 2,
    minEmailAddresses: 2,
  });

  const userWithSingle = createWebexIntUser({
    minPhoneNumbers: 1,
    maxPhoneNumbers: 1,
    maxEmailAddresses: 0,
  });

  test('should render', () => {
    const { asFragment } = render(
      <SearchContactsItem user={userWithMultiple} index={0} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('shows dropdown for multiple addresses', async () => {
    const spy = jest.spyOn(mockAdapter.makeCallAdapter, 'makeCall');
    const { getByLabelText, findByText } = render(
      <AdapterContext.Provider value={mockAdapter}>
        <SearchContactsItem user={userWithMultiple} index={0} />
      </AdapterContext.Provider>
    );
    fireEvent.click(getByLabelText('makeAudioCallTo'));
    const button = await findByText(userWithMultiple.phoneNumbers[0].address);
    fireEvent.click(button);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('calls immediately for single address', async () => {
    const spy = jest.spyOn(mockAdapter.makeCallAdapter, 'makeCall');
    const { getByLabelText } = render(
      <AdapterContext.Provider value={mockAdapter}>
        <SearchContactsItem user={userWithSingle} index={0} />
      </AdapterContext.Provider>
    );
    fireEvent.click(getByLabelText('makeAudioCallTo'));
    expect(spy).toHaveBeenCalled();
  });

  test('hides dropdown on other button click', async () => {
    const { getByLabelText, findByText, getByTestId, queryByTestId } = render(
      <SearchContactsItem user={userWithMultiple} index={0} />
    );
    fireEvent.click(getByLabelText('makeAudioCallTo'));
    await findByText(userWithMultiple.phoneNumbers[0].address);
    expect(getByTestId('webex-call-select-popover--audio')).toBeVisible();
    expect(queryByTestId('webex-call-select-popover--video')).toBeNull();
    fireEvent.click(getByLabelText('makeVideoCallTo'));
    await findByText(userWithMultiple.phoneNumbers[0].address);
    expect(queryByTestId('webex-call-select-popover--audio')).toBeNull();
    expect(getByTestId('webex-call-select-popover--video')).toBeVisible();
  });

  test('hides dropdown on de-select', async () => {
    const { rerender, getByLabelText, findByText, getByTestId, queryByTestId } =
      render(
        <SearchContactsItem user={userWithMultiple} index={0} isSelected />
      );
    fireEvent.click(getByLabelText('makeAudioCallTo'));
    await findByText(userWithMultiple.phoneNumbers[0].address);
    expect(getByTestId('webex-call-select-popover--audio')).toBeVisible();
    rerender(<SearchContactsItem user={userWithMultiple} index={0} />);
    expect(queryByTestId('webex-call-select-popover--audio')).toBeNull();
  });
});
