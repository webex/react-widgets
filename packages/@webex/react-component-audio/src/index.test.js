import React from 'react';
import renderer from 'react-test-renderer';

import Audio from '.';

describe('Audio component', () => {
  let component;

  it('renders properly', () => {
    component = renderer.create(<Audio srcObject={{id: 'testSrcObject'}} />);

    expect(component).toMatchSnapshot();
  });
});
