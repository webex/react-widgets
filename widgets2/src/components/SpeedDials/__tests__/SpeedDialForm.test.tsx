import React from 'react';

import { render } from '@testing-library/react';
import { SpeedDialForm } from '../SpeedDialForm';
import { createSpeedDialItems } from '../../../test-utils';

const [speedDialItem] = createSpeedDialItems(2);

describe('SpeedDialForm', () => {
  test('should render', () => {
    const { asFragment } = render(<SpeedDialForm data={speedDialItem} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
