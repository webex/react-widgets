import React from 'react';
import TestRenderer from 'react-test-renderer';

import { GenericModal } from './GenericModal';

describe('GenericModal', () => {
  test('should render - isOpen', () => {
    const component = TestRenderer.create(<GenericModal isOpen />);

    expect(component.toJSON()).toMatchSnapshot();
  });
  test('should render - isRound', () => {
    const component = TestRenderer.create(<GenericModal isOpen isRound />);

    expect(component.toJSON()).toMatchSnapshot();
  });
});
