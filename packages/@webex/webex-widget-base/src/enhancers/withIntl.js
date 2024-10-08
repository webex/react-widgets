import React from 'react';
import {IntlProvider, injectIntl} from 'react-intl';
import {shape, func} from 'prop-types';

import {setWrappedDisplayName} from '@webex/react-component-utils';

export default function withIntl({
  messages,
  locale
}) {
  // eslint-disable-reason Dynamically loading locale data to lower overhead
  /* eslint-disable import/no-dynamic-require, global-require */
  if (!Intl.PluralRules) {
    require('@formatjs/intl-pluralrules/polyfill');
    require(`@formatjs/intl-pluralrules/dist/locale-data/${locale}`);
  }

  if (!Intl.RelativeTimeFormat) {
    require('@formatjs/intl-relativetimeformat/polyfill');
    require(`@formatjs/intl-relativetimeformat/dist/locale-data/${locale}`);
  }
  /* eslint-enable import/no-dynamic-require, global-require */

  return (BaseComponent) => {
    const WrappedComponent = injectIntl(BaseComponent);

    function WithIntl(props) {
      return (
        <IntlProvider locale={locale} messages={messages} >
          <WrappedComponent {...props} />
        </IntlProvider>
      );
    }

    WrappedComponent.propTypes = {
      // Grabbed from https://github.com/sharetribe/ftw-daily/blob/master/src/util/reactIntl.js#L10
      intl: shape({
        formatDate: func.isRequired,
        formatHTMLMessage: func.isRequired,
        formatMessage: func.isRequired,
        formatNumber: func.isRequired,
        formatPlural: func.isRequired,
        formatRelativeTime: func.isRequired,
        formatTime: func.isRequired
      })
    };

    return setWrappedDisplayName('WithIntl')(WithIntl);
  };
}
