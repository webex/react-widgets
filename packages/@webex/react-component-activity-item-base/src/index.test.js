import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import ActivityItemBase from '.';

const renderer = new ShallowRenderer();

describe('ActivityItemBase component', () => {
  let props;

  const child = <div>Test Content</div>;

  beforeEach(() => {
    props = {
      actorId: 'user-abc-123',
      hasError: false,
      id: 'test-123-123-123-123',
      isAdditional: false,
      isFlagged: false,
      isFlagPending: false,
      isPending: false,
      isSelf: false,
      name: 'Test User',
      timestamp: '2016-09-20T19:52:57.186Z'
    };
  });

  it('renders properly', () => {
    renderer.render(
      <ActivityItemBase {...props} >
        {child}
      </ActivityItemBase>
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly when self', () => {
    props.isSelf = true;
    renderer.render(
      <ActivityItemBase {...props} >
        {child}
      </ActivityItemBase>
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly when pending', () => {
    props.isPending = true;
    renderer.render(
      <ActivityItemBase {...props} >
        {child}
      </ActivityItemBase>
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly when flagged', () => {
    props.isFlagged = true;
    renderer.render(
      <ActivityItemBase {...props} >
        {child}
      </ActivityItemBase>
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly when flagged pending', () => {
    props.isFlagged = true;
    props.isFlagPending = true;
    renderer.render(
      <ActivityItemBase {...props} >
        {child}
      </ActivityItemBase>
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly with error', () => {
    props.hasError = true;
    renderer.render(
      <ActivityItemBase {...props} >
        {child}
      </ActivityItemBase>
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });

  it('renders properly when additional', () => {
    props.isAdditional = true;
    renderer.render(
      <ActivityItemBase {...props} >
        {child}
      </ActivityItemBase>
    );
    const component = renderer.getRenderOutput();

    expect(component).toMatchSnapshot();
  });
});
