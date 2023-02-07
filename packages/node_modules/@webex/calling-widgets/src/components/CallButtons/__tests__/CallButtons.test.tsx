import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { AdapterContext } from '../../../contexts/AdapterContext';
import { CallButtons } from '../CallButtons';
import { SDKJSONAdapter } from '../../../adapters/JSONAdapters';

const mockAdapter = new SDKJSONAdapter({});

describe('CallButtons', () => {
  test('should render', () => {
    const { asFragment } = render(<CallButtons address="123456789" />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('are interactive', () => {
    const address = '123456789';
    const spy = jest.spyOn(mockAdapter.makeCallAdapter, 'makeCall');
    const { getByLabelText } = render(
      <AdapterContext.Provider value={mockAdapter}>
        <CallButtons address={address} />
      </AdapterContext.Provider>
    );
    const audioCallButton = getByLabelText('makeAudioCallTo');
    const audioVideoButton = getByLabelText('makeVideoCallTo');
    fireEvent.click(audioCallButton);
    expect(spy).toHaveBeenCalledWith(address, false);
    fireEvent.click(audioVideoButton);
    expect(spy).toHaveBeenCalledWith(address, true);
  });

  test('show disabled state on empty address', () => {
    const { asFragment } = render(<CallButtons address="" />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('show disabled state on filled address, disabled flag', () => {
    const { asFragment } = render(<CallButtons address="" disabled />);
    expect(asFragment()).toMatchSnapshot();
  });
});
