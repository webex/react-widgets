import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import LoadingScreen from '.';

const renderer = new ShallowRenderer();

describe('LoadingScreen component', () => {
  it('renders properly', () => {
    renderer.render(<LoadingScreen loadingMessage="Loading" />);
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
