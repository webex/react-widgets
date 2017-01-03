import React from 'react';
import ReactDOM from 'react-dom';

import Button from '@ciscospark/react-component-button';
import Icon, {ICON_TYPE_MESSAGE} from '@ciscospark/react-component-icon';


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
