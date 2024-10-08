import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import uuid from 'uuid';

import ComposerButtons from './ComposerButtons';

const renderer = new ShallowRenderer();

describe('ComposerButtons component', () => {
  let props;
  let uuidSpy;

  beforeEach(() => {
    props = {
      composerActions: {
        attachFiles: true
      },
      onAttachFile: () => {}
    };

    uuidSpy = jest.spyOn(uuid, 'v4').mockReturnValue('FAKE_INPUT_ID');
  });

  afterEach(() => uuidSpy.mockRestore);

  it('renders properly with attachFiles enabled', () => {
    renderer.render(
      <ComposerButtons {...props} />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly with attachFiles enabled', () => {
    props.composerActions.attachFiles = false;
    renderer.render(
      <ComposerButtons {...props} />
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
