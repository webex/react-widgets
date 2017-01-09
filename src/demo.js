import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import moment from 'moment';

import {addLocaleData, IntlProvider} from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import messages from './locales/en';

import {
  Icon,
  Button,
  AddFileButton,
  Avatar,
  ICON_TYPE_MESSAGE,
  ChipBase,
  ChipFile,
  ConfirmationModal,
  ListSeparator,
  NewMessagesSeparator,
  DaySeparator,
  LoadingScreen,
  Spinner,
  ScrollToBottomButton,
  TextArea,
  TitleBar,
  TypingIndicator,
  TypingAvatar
} from './';

import styles from './styles.css';

export default function Root() {
  function onClick() {return false;}
  const today = moment();
  addLocaleData(enLocaleData);
  return (
    <div>
      <div className={styles.component} ><Button label="BUTTON" onClick={onClick} /></div>
      <div className={styles.component} ><Icon type={ICON_TYPE_MESSAGE} /></div>
      <div className={styles.component} ><AddFileButton /></div>
      <div className={styles.component} ><Avatar name="Adam" /></div>
      <div className={classNames(styles.component, styles.chipBase)} >
        <ChipBase>{`Test Chip Base`}</ChipBase>
      </div>
      <div className={classNames(styles.component, styles.chipBase)} >
        <ChipFile name="Test File" size="100MB" type="image" />
      </div>
      <div className={classNames(styles.component, styles.frame)} >
        <ConfirmationModal
          messages={{
            actionButtonText: `Yes`,
            body: `Are you sure?`,
            cancelButtonText: `No`,
            title: `Test Modal`
          }}
        />
      </div>
      <div className={styles.component} ><ListSeparator isInformative primaryText="Test 123" /></div>
      <div className={styles.component} ><NewMessagesSeparator /></div>
      <div className={styles.component} >
        <DaySeparator
          fromDate={moment(today).subtract(5, `days`)}
          now={today}
          toDate={moment(today).subtract(1, `days`)}
        />
      </div>
      <div className={styles.component} ><Spinner /></div>
      <div className={styles.component} ><LoadingScreen loadingMessage="Loading Cisco Spark" /></div>
      <div className={styles.component} ><ScrollToBottomButton onClick={onClick} /></div>
      <div className={styles.component} >
        <TextArea
          placeholder="TextArea Placeholder"
          rows={2}
          value=""
        />
      </div>
      <div className={styles.component} ><TitleBar name="Spock" /></div>
      <div className={styles.component} ><TypingAvatar isTyping name="Spock" /></div>
      <div className={styles.component} ><TypingIndicator /></div>
    </div>
  );
}

ReactDOM.render(
  <IntlProvider locale={`en`} messages={messages}>
    <Root />
  </IntlProvider>,
  document.getElementById(`main`)
);
