import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import {addLocaleData} from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

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
} from '..';

import styles from './styles.css';

const Components = () => {
  function onClick() {return false;}
  const today = moment();
  addLocaleData(enLocaleData);

  return (
    <div>
      <List>
        <Subheader>{`<Button>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><Button label="BUTTON" onClick={onClick} /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<Icon>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><Icon type={ICON_TYPE_MESSAGE} /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<AddFileButton>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><AddFileButton /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<Avatar>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><Avatar name="Adam" /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<ChipBase>`}</Subheader>
        <ListItem>
          <div className={classNames(styles.component, styles.chipBase)} >
            <ChipBase>{`Test Chip Base`}</ChipBase>
          </div>
        </ListItem>
        <Divider />
        <Subheader>{`<ChipFile>`}</Subheader>
        <ListItem>
          <div className={classNames(styles.component, styles.chipBase)} >
            <ChipFile name="Test File" size="100MB" type="image" />
          </div>
        </ListItem>
        <Divider />
        <Subheader>{`<ConfirmationModal>`}</Subheader>
        <ListItem>
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
        </ListItem>
        <Divider />
        <Subheader>{`<ListSeparator>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><ListSeparator isInformative primaryText="Test 123" /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<NewMessagesSeparator>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><NewMessagesSeparator /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<DaySeparator>`}</Subheader>
        <ListItem>
          <div className={styles.component} >
            <DaySeparator
              fromDate={moment(today).subtract(5, `days`)}
              now={today}
              toDate={moment(today).subtract(1, `days`)}
            />
          </div>
        </ListItem>
        <Divider />
        <Subheader>{`<Spinner>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><Spinner /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<LoadingScreen>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><LoadingScreen loadingMessage="Loading Cisco Spark" /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<ScrollToBottomButton>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><ScrollToBottomButton onClick={onClick} /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<TextArea>`}</Subheader>
        <ListItem>
          <div className={styles.component} >
            <TextArea
              placeholder="TextArea Placeholder"
              rows={2}
              value=""
            />
          </div>
        </ListItem>
        <Divider />
        <Subheader>{`<TitleBar>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><TitleBar name="Spock" /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<TypingAvatar>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><TypingAvatar isTyping name="Spock" /></div>
        </ListItem>
        <Divider />
        <Subheader>{`<TypingIndicator>`}</Subheader>
        <ListItem>
          <div className={styles.component} ><TypingIndicator /></div>
        </ListItem>
        <Divider />
      </List>
    </div>
  );
};

Components.path = `/components`;
Components.title = `Components`;

export default Components;
