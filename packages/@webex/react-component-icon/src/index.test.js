import React from 'react';
import renderer from 'react-test-renderer';

import Icon, {ICONS} from '.';

describe('Icon component', () => {
  it('renders a default icon properly', () => {
    const component = renderer.create(<Icon
      title="My Icon"
      type={ICONS.ICON_TYPE_ADD}
    />);

    expect(component).toMatchSnapshot();
  });

  it('renders an icon with color properly', () => {
    const component = renderer.create(<Icon
      color="white"
      type={ICONS.ICON_TYPE_ADD}
    />);

    expect(component).toMatchSnapshot();
  });

  it('renders an icon with size properly', () => {
    const component = renderer.create(<Icon
      size="36px"
      type={ICONS.ICON_TYPE_ADD}
    />);

    expect(component).toMatchSnapshot();
  });
});
