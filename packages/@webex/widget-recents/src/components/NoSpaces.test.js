import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import NoSpaces from './NoSpaces';

const renderer = new ShallowRenderer();

let props, component;

describe('NoSpaces component', () => {
  beforeEach(() => {
    props = {
      title: 'No Spaces Title',
      emptyMessage: 'No spaces message.'
    };
  });

  it('renders correctly', () => {
    renderer.render(
      <NoSpaces {...props} />
    );

    component = renderer.getRenderOutput();
    expect(component).toMatchSnapshot();
  });
});
