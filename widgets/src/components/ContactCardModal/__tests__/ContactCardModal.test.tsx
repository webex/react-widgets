import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ContactCardModal } from '../ContactCardModal';
import { createWebexIntUsers } from '../../../test-utils';

const user = createWebexIntUsers({ count: 1 })[0];

describe('ContactCardModal', () => {
  test('renders', async () => {
    const closeFn = jest.fn();
    const { asFragment, getByLabelText } = render(
      <ContactCardModal user={user} closeModal={closeFn} />
    );
    expect(asFragment()).toMatchSnapshot();
    const closeButton = getByLabelText('close modal');
    fireEvent.click(closeButton);
    expect(closeFn).toHaveBeenCalledTimes(1);
  });
});
