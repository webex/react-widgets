import React from 'react';
import ReactDOM from 'react-dom';

import {Icon, Button, ICON_TYPE_MESSAGE} from './';


export default function Root() {
  function onClick() {return false;}
  return (
    <div>
      <Button label="BUTTON" onClick={onClick} />
      <Icon type={ICON_TYPE_MESSAGE} />
    </div>
  );
}

ReactDOM.render(
  <Root />,
  document.getElementById(`main`)
);
