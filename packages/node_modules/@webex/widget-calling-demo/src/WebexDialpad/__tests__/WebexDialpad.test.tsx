import React from 'react';
import {
  fireEvent,
  getByLabelText,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { WebexDialpad } from '../WebexDialpad';
import { createWebexIntUsers } from '../../test-utils';
import { AdapterProvider } from '../../contexts/AdapterContext';
import {
  SDKJSONAdapter,
  SearchContactsJSONAdapterDataSource,
} from '../../adapters/JSONAdapters';

const directoryUsers = createWebexIntUsers({ count: 4 });
const contactUsers = createWebexIntUsers({ count: 4 });

const mockDatasource: SearchContactsJSONAdapterDataSource = {
  directory: directoryUsers,
  contacts: contactUsers,
};

const mockAdapter = new SDKJSONAdapter({ contacts: mockDatasource });

describe('WebexDialpad', () => {
  test('renders', async () => {
    const { asFragment } = render(<WebexDialpad />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('numpad can be interacted with', async () => {
    const { findByText, findByPlaceholderText } = render(<WebexDialpad />);

    const input = await findByPlaceholderText('search');
    fireEvent.click(await findByText(9));
    fireEvent.click(await findByText(2));
    expect((input as HTMLInputElement).value).toBe('92');
  });

  test('opens dropdown and calls address', async () => {
    const spy = jest.spyOn(mockAdapter.makeCallAdapter, 'makeCall');
    const { getByText, findByText, getByTestId, findByPlaceholderText } =
      render(
        <AdapterProvider adapter={mockAdapter}>
          <WebexDialpad />
        </AdapterProvider>
      );

    const input = await findByPlaceholderText('search');
    fireEvent.change(input, { target: { value: directoryUsers[0].name } });
    await waitForElementToBeRemoved(() =>
      getByTestId('loading-spinner-directory')
    );
    const item: HTMLElement = getByText(directoryUsers[0].name);
    fireEvent.click(item);
    fireEvent.click(getByLabelText(item.parentElement!, 'makeAudioCallTo'));
    const button = await findByText(directoryUsers[0].phoneNumbers[0].address);
    fireEvent.click(button);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
