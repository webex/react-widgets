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
    </div>
  );
}

export default Main;
