import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { NumberPad } from '../NumberPad';

describe('NumberPad', () => {
  test('should render', () => {
    const { asFragment } = render(<NumberPad onButtonPress={() => {}} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('can be interacted with', async () => {
    const callBack = jest.fn();
    const { findByText } = render(<NumberPad onButtonPress={callBack} />);

    fireEvent.click(await findByText(9));
    fireEvent.click(await findByText(2));
    expect(callBack).toHaveBeenCalledTimes(2);
  });
});
