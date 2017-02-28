import React from 'react';
import ReactDOM from 'react-dom';

import {IntlProvider} from 'react-intl';
import messages from './locales/en';

import '@ciscospark/react-component-spark-fonts';

import DemoWidgetMessageMeet from './demo-widget-message-meet';


ReactDOM.render(
  <IntlProvider locale={`en`} messages={messages}>
    <DemoWidgetMessageMeet />
  </IntlProvider>,
  document.getElementById(`main`)
);
