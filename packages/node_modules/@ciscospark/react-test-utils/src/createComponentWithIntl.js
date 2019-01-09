import React from 'react';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';

import {IntlProvider} from 'react-intl';

function createComponentWithIntl(children, props = {locale: 'en'}) {
  return renderer.create(
    <IntlProvider {...props}>
      {children}
    </IntlProvider>
  );
}

export function createShallowComponentWithIntl(children, props = {locale: 'en'}) {
  const shallowRenderer = new ShallowRenderer();

  shallowRenderer.render(
    <IntlProvider {...props}>
      {children}
    </IntlProvider>
  );

  return shallowRenderer.getRenderOutput();
}


export default createComponentWithIntl;
