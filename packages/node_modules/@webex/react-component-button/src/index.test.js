import React from 'react';
import renderer from 'react-test-renderer';

import Button from '.';

describe('Button component', () => {
  const onClick = jest.fn();

  it('renders properly with icon type', () => {
    const component = renderer.create(<Button
      iconType="delete"
      onClick={onClick}
      title="delete"
    />);

    expect(component).toMatchSnapshot();
  });

  it('renders properly with icon type and color', () => {
    const component = renderer.create(<Button
      iconColor="purple"
      iconType="delete"
      onClick={onClick}
      title="delete"
    />);

    expect(component).toMatchSnapshot();
  });

  it('renders properly with label', () => {
    const component = renderer.create(<Button
      label="button label"
    />);

    expect(component).toMatchSnapshot();
  });

  it('renders properly with label and position', () => {
    const component = renderer.create(<Button
      label="button label"
      labelPosition="bottom"
    />);

    expect(component).toMatchSnapshot();
  });

  it('renders properly with children', () => {
    const button = (
      <Button accessibilityLabel="Children">
        <div>Children</div>
      </Button>
    );
    const component = renderer.create(button);

    expect(component).toMatchSnapshot();
  });
});
