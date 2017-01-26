import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import {IntlProvider} from 'react-intl';
import messages from './locales/en';

import SparkFonts from '@ciscospark/react-component-spark-fonts';

import DemoWrapper from './demo-wrapper';
import DemoWidgetMessageMeet from './demo-widget-message-meet';
import DemoHome from './demo-home';
import Components from './components';

ReactDOM.render(
  <SparkFonts>
    <IntlProvider locale={`en`} messages={messages}>
      <Router history={browserHistory}>
        <Route
          component={DemoWrapper}
          path="/"
        >
          <IndexRoute component={DemoHome} />
          <Route
            component={Components}
            path={Components.path}
          />
          <Route
            component={DemoWidgetMessageMeet}
            path={DemoWidgetMessageMeet.path}
          />
        </Route>
      </Router>
    </IntlProvider>
  </SparkFonts>,
  document.getElementById(`main`)
);
