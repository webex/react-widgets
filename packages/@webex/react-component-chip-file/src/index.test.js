import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ChipFile from '.';

const renderer = new ShallowRenderer();

describe('ChipFile component', () => {
  const props = {
    id: 'chip-id',
    name: 'testFile.jpg',
    size: '123 KB',
    thumbnail: 'blob:localhost/testFile.jpg'
  };

  it('renders properly', () => {
    renderer.render(<ChipFile {...props} />);
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
