import React, { useRef } from 'react';
import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import {
  SDKJSONAdapter,
  SearchContactsJSONAdapterDataSource,
} from '../../adapters/JSONAdapters';
import {
  WebexSearchContacts,
  WebexSearchContactsHandle,
} from '../WebexSearchContacts';
import * as contactSearch from '../../hooks/useContactSearch';
import { AdapterProvider } from '../../contexts/AdapterContext';

const mockDatasource: SearchContactsJSONAdapterDataSource = {
  directory: [
    {
      id: '1234',
      name: 'Charlie McGee',
      phoneNumbers: [
        {
          type: 'Home',
          address: '1234565688',
        },
        {
          type: 'Mobile',
          address: '1236414',
        },
      ],
      emailAddresses: [
        {
          type: 'email',
          address: 'charlie@me.com',
        },
      ],
    },
    {
      id: '521411',
      name: 'Greg Smith',
      phoneNumbers: [
        {
          type: 'Home',
          address: '1234565688',
        },
      ],
      emailAddresses: [
        {
          type: 'email',
          address: 'greg.sprognpsogng@spogneg.com',
        },
      ],
    },
  ],
  contacts: [
    {
      id: '60909',
      name: 'Charles Pad',
      phoneNumbers: [
        {
          type: 'Home',
          address: '959303020',
        },
      ],
      emailAddresses: [
        {
          type: 'email',
          address: 'charles@pad.com',
        },
      ],
    },
  ],
};

const mockAdapter = new SDKJSONAdapter({ contacts: mockDatasource });

describe('WebexSearchContacts', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should render', () => {
    const { asFragment } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSearchContacts />
      </AdapterProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('shows loading state', () => {
    const contactSearchMock = jest
      .spyOn(contactSearch, 'useContactSearch')
      .mockReturnValue([
        ['outlook', 'directory'],
        { count: 0, items: {} },
        true,
      ]);
    const inputPlaceholder = 'Input';
    const { getByTestId, getByPlaceholderText } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSearchContacts label={inputPlaceholder} />
      </AdapterProvider>
    );
    const input = getByPlaceholderText(inputPlaceholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'greg' } });
    expect(getByTestId('loading-spinner-outlook')).toBeDefined();
    expect(getByTestId('loading-spinner-directory')).toBeDefined();
    contactSearchMock.mockRestore();
  });

  test('shows single data source', async () => {
    const inputPlaceholder = 'Input';
    const { asFragment, getByPlaceholderText, getByTestId } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSearchContacts label={inputPlaceholder} />
      </AdapterProvider>
    );
    const input = getByPlaceholderText(inputPlaceholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'greg' } });
    await waitForElementToBeRemoved(() =>
      getByTestId('loading-spinner-directory')
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('shows multiple data sources', async () => {
    const inputPlaceholder = 'Input';
    const { asFragment, getByPlaceholderText, getByTestId } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSearchContacts label={inputPlaceholder} />
      </AdapterProvider>
    );
    const input = getByPlaceholderText(inputPlaceholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'char' } });
    await waitForElementToBeRemoved(() =>
      getByTestId('loading-spinner-directory')
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('shows no contacts found message', async () => {
    const inputPlaceholder = 'Input';
    const noFoundMessage = 'None found';
    const { getByText, getByPlaceholderText, getByTestId } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSearchContacts
          label={inputPlaceholder}
          noContactsFoundMessage={noFoundMessage}
        />
      </AdapterProvider>
    );
    const input = getByPlaceholderText(inputPlaceholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'frank' } });
    await waitForElementToBeRemoved(() =>
      getByTestId('loading-spinner-directory')
    );
    expect(getByText(noFoundMessage)).toBeDefined();
  });

  test('parent can append characters', () => {
    const appendButtonText = 'Append 4';
    const inputPlaceholder = 'Input';
    const Wrapper: React.FC = () => {
      const ref = useRef<WebexSearchContactsHandle>(null);
      return (
        <>
          <AdapterProvider adapter={mockAdapter}>
            <WebexSearchContacts ref={ref} label={inputPlaceholder} />
          </AdapterProvider>
          <button
            onClick={() => ref.current?.appendValueToInput('4')}
            type="button"
          >
            {appendButtonText}
          </button>
        </>
      );
    };
    const { getByText, getByPlaceholderText } = render(<Wrapper />);
    const appendButton = getByText(appendButtonText);
    const input = getByPlaceholderText(inputPlaceholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'frank' } });
    expect(input.value).toBe('frank');
    fireEvent.click(appendButton);
    expect(input.value).toBe('frank4');
  });

  test('pressing escape hides dropdown', async () => {
    const inputPlaceholder = 'Input';
    const { getByPlaceholderText, getByTestId, queryByTestId } = render(
      <AdapterProvider adapter={mockAdapter}>
        <WebexSearchContacts label={inputPlaceholder} />
      </AdapterProvider>
    );
    const input = getByPlaceholderText(inputPlaceholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'gre' } });
    await waitForElementToBeRemoved(() =>
      getByTestId('loading-spinner-directory')
    );
    expect(getByTestId('webex-search-contacts-dropdown')).toBeDefined();
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape', charCode: 27 });
    expect(queryByTestId('webex-search-contacts-dropdown')).toBeNull();
    fireEvent.change(input, { target: { value: 'greg' } });
    expect(getByTestId('webex-search-contacts-dropdown')).toBeDefined();
  });

  test('clicking outside hides dropdown', async () => {
    const inputPlaceholder = 'Input';
    const { getByPlaceholderText, getByTestId, queryByTestId, getByText } =
      render(
        <>
          <AdapterProvider adapter={mockAdapter}>
            <WebexSearchContacts label={inputPlaceholder} />
          </AdapterProvider>
          <div>Outer element</div>
        </>
      );
    const input = getByPlaceholderText(inputPlaceholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'gre' } });
    await waitForElementToBeRemoved(() =>
      getByTestId('loading-spinner-directory')
    );
    expect(getByTestId('webex-search-contacts-dropdown')).toBeDefined();
    fireEvent.click(getByText('Outer element'), {});
    expect(queryByTestId('webex-search-contacts-dropdown')).toBeNull();
    fireEvent.change(input, { target: { value: 'greg' } });
    expect(getByTestId('webex-search-contacts-dropdown')).toBeDefined();
  });
});
