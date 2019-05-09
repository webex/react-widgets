import React from 'react';

import BasicComponents from './BasicComponents';
import RecentsComponents from './recents-components';

function Main() {
  return (
    <div>
      <h1>React Samples</h1>
      <h2>Basic Components</h2>
      <BasicComponents />
      <h2>Recents Components</h2>
      <RecentsComponents />
      <h2>Base Elements that should not be modified by momentum css</h2>
      <p><a href=".">Link</a></p>
      <p><b>bold</b></p>
    </div>
  );
}

export default Main;
