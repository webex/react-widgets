/* eslint-disable react/no-set-state */
import React, {Component, PropTypes} from 'react';
import {IndexLink, Link} from 'react-router';
import classNames from 'classnames';
import DemoHome from '../demo-home';
import DemoWidgetMessageMeet from '../demo-widget-message-meet';
import Components from '../components';
import {Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

import styles from './styles.css';

class DemoWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: `Spark React Components`
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <div>
        <Toolbar>
          <ToolbarGroup firstChild>
            <IndexLink to={DemoHome.path}><ToolbarTitle text={this.state.title} /></IndexLink>
          </ToolbarGroup>
          <ToolbarGroup>
            <Link to={Components.path}><RaisedButton label={Components.title} /></Link>
            <ToolbarSeparator />
            <Link to={DemoWidgetMessageMeet.path}><RaisedButton label={DemoWidgetMessageMeet.title} /></Link>
          </ToolbarGroup>
        </Toolbar>
        <div className={classNames(styles.main)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}


DemoWrapper.propTypes = {
  children: PropTypes.node
};

export default DemoWrapper;
