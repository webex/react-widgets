import React from 'react';
import renderer from 'react-test-renderer';

import ActivityText from '.';

describe('ActivityText component', () => {
  const displayName = 'Test Text';
  const cleanContent = '<em>Test Text</em>';
  const cleanLink = '<a href="https://example.com">Test Text</a>';
  const cleanLinkWithTargetBlank = '<a href="https://example.com" target="_blank">Test Text</a>';
  const cleanEmailLink = '<a href="mailto:someone@example.com">someone@example.com</a>';
  const cleanTelLink = '<a href="tel://+1234567890">Call me</a>';
  const dirtyContent = '<script>alert(\'dirtyContent\')</script>';

  it('renders clean text properly', () => {
    const component = renderer.create(<ActivityText displayName={displayName} />);

    expect(component).toMatchSnapshot();
  });

  it('renders clean dangerous text properly', () => {
    const component = renderer.create(<ActivityText content={cleanContent} />);

    expect(component).toMatchSnapshot();
  });

  it('renders clean links properly', () => {
    const component = renderer.create(<ActivityText content={cleanLink} />);

    expect(component).toMatchSnapshot();
  });

  it('renders clean links with target _blank properly', () => {
    const component = renderer.create(<ActivityText content={cleanLinkWithTargetBlank} />);

    expect(component).toMatchSnapshot();
  });

  it('renders clean email links properly', () => {
    const component = renderer.create(<ActivityText content={cleanEmailLink} />);

    expect(component).toMatchSnapshot();
  });

  it('renders clean tel links properly', () => {
    const component = renderer.create(<ActivityText content={cleanTelLink} />);

    expect(component).toMatchSnapshot();
  });

  it('renders dirty dangerous text properly', () => {
    const component = renderer.create(<ActivityText content={dirtyContent} />);

    expect(component).toMatchSnapshot();
  });
});
