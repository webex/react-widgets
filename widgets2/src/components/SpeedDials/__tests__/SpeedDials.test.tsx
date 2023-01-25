import React from 'react';

import { render } from '@testing-library/react';
import { SpeedDials } from '../SpeedDials';
import { createSpeedDialItems } from '../../../test-utils';

describe('SpeedDials', () => {
  test('should render', () => {
    const { asFragment } = render(
      <SpeedDials items={createSpeedDialItems(5)} />
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
