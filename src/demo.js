import React from 'react';
import ReactDOM from 'react-dom';

import {
  Icon,
  Button,
  AddFileButton,
  Avatar,
  ICON_TYPE_MESSAGE
} from './';

import styles from './styles.css';

export default function Root() {
  function onClick() {return false;}
  return (
    <div>
      <div className={styles.component} ><Button label="BUTTON" onClick={onClick} /></div>
      <div className={styles.component} ><Icon type={ICON_TYPE_MESSAGE} /></div>
      <div className={styles.component} ><AddFileButton /></div>
      <div className={styles.component} ><Avatar name="Adam" /></div>
    </div>
  );
}

ReactDOM.render(
  <Root />,
  document.getElementById(`main`)
);
