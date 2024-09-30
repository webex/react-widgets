import React from 'react';
import renderer from 'react-test-renderer';

import Cover from '.';

describe('Cover component', () => {
  const component = renderer.create(<Cover message="This is a message" />);

  it('renders properly', () => {
    expect(component).toMatchSnapshot();
  });
});
