import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import FileShareDisplay from '.';

const renderer = new ShallowRenderer();

describe('FileShareDisplay component', () => {
  let props;
  const handleClick = jest.fn();

  beforeEach(() => {
    props = {
      file: {
        image: true,
        displayName: 'testImage.js',
        url: 'http://cisco.com'
      },
      isAdditional: false,
      isPending: false
    };
  });

  it('renders properly', () => {
    renderer.render(
      <FileShareDisplay
        file={props.file}
        isFetching={props.isFetching}
        isPending={props.isPending}
        objectUrl={props.file.url}
        onDownloadClick={handleClick}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly while pending', () => {
    props.isPending = true;
    renderer.render(
      <FileShareDisplay
        file={props.file}
        isFetching={props.isFetching}
        isPending={props.isPending}
        objectUrl={props.file.url}
        onDownloadClick={handleClick}
      />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
