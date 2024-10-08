import React from 'react';
import renderer from 'react-test-renderer';

import ScrollingActivity from '.';

describe('ScrollingActivity container', () => {
  it('renders properly', () => {
    const component = renderer.create(
      <ScrollingActivity>
        List of Activity
      </ScrollingActivity>
    );

    expect(component).toMatchSnapshot();
  });
  it('renders properly loading history', () => {
    const component = renderer.create(
      <ScrollingActivity isLoadingHistoryUp>
        List of Activity
      </ScrollingActivity>
    );

    expect(component).toMatchSnapshot();
  });
});
