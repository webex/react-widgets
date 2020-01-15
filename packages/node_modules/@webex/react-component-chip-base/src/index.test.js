import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ChipBase from '.';

const renderer = new ShallowRenderer();

describe('ChipBase component', () => {
  let component;
  const onRemove = jest.fn();
  const props = {
    children: <div />,
    id: 'testFile',
    onRemove
  };

  it('renders properly', () => {
    renderer.render(<ChipBase {...props} />);
    component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
