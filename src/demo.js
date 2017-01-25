import React from 'react';
import ReactDOM from 'react-dom';

import {IntlProvider} from 'react-intl';
import messages from './locales/en';

import Components from './components';


ReactDOM.render(
  <IntlProvider locale={`en`} messages={messages}>
    <Components />
  </IntlProvider>,
  document.getElementById(`main`)
);
