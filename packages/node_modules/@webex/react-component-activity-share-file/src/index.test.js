import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ActivityShareFile from '.';

const renderer = new ShallowRenderer();

describe('ActivityShareFile component', () => {
  const props = {
    file: {
      displayName: 'testImage.js',
      url: 'http://cisco.com'
    },
    isPending: false,
    onDownloadClick: jest.fn()
  };

  it('renders properly', () => {
    renderer.render(<ActivityShareFile {...props} />);
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly while pending', () => {
    props.isPending = true;
    renderer.render(<ActivityShareFile {...props} />);
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
