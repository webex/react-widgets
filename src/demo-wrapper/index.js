import React from 'react';
import {IndexLink, Link} from 'react-router';
import DemoHome from '../demo-home';
import DemoWidgetMessageMeet from '../demo-widget-message-meet';
import Components from '../components';

const DemoWrapper = (props) => {
  const title = `Spark React Components`;
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        <li><IndexLink to={DemoHome.path}>{DemoHome.title}</IndexLink></li>
        <li><Link to={Components.path}>{Components.title}</Link></li>
        <li><Link to={DemoWidgetMessageMeet.path}>{DemoWidgetMessageMeet.title}</Link></li>
      </ul>
      {props.children}
    </div>
  );
};

DemoWrapper.propTypes = {
  children: React.PropTypes.node
};

export default DemoWrapper;
