/* eslint-disable react/no-set-state */
import React, {Component} from 'react';
import classNames from 'classnames';
import cookie from 'react-cookie';
import autobind from 'autobind-decorator';

import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';

import SparkLogo from '@ciscospark/react-component-spark-logo';
import WidgetMessageMeet from '@ciscospark/widget-message-meet';

import ExampleCode, {MODE_REACT, MODE_INLINE} from '../example-code';
import DemoLogin from '../demo-login';

import styles from './styles.css';


class DemoWidgetMessageMeet extends Component {
  constructor(props) {
    super(props);
    const l = window.location;
    const redirectUri = `${l.protocol}//${l.host}${l.pathname}`.replace(/\/$/, ``);
    const clientId = process.env.MESSAGE_DEMO_CLIENT_ID;
    const clientSecret = process.env.MESSAGE_DEMO_CLIENT_SECRET;
    const hasToken = !!cookie.load(`accessToken`);
    this.state = {
      authenticate: false,
      hasToken,
      mode: MODE_INLINE,
      accessToken: cookie.load(`accessToken`) || ``,
      toPersonEmail: cookie.load(`toPersonEmail`) || ``,
      running: false,
      clientId,
      clientSecret,
      scope: `spark:kms spark:rooms_read spark:rooms_write spark:memberships_read spark:memberships_write spark:messages_read spark:messages_write`,
      redirectUri
    };
  }

  shouldComponentUpdate() {
    return true;
  }

  @autobind
  handleSubmit(e) {
    e.preventDefault();
    cookie.save(`accessToken`, this.state.accessToken);
    cookie.save(`toPersonEmail`, this.state.toPersonEmail);
    this.setState({running: true});
  }

  @autobind
  handleAccessTokenChange(accessToken) {
    return this.setState({accessToken, hasToken: !!accessToken});
  }

  @autobind
  handleEmailChange(e) {
    return this.setState({toPersonEmail: e.target.value});
  }

  @autobind
  handleModeChange(e) {
    return this.setState({mode: e.target.value});
  }

  @autobind
  handleClearToken() {
    return this.setState({hasToken: false}, () => cookie.remove(`accessToken`));
  }

  createWidget(e) {
    e.preventDefault();
    return this.setState({running: true});
  }

  render() {
    const loadButtonEnabled = this.state.accessToken && this.state.toPersonEmail;
    if (this.state.running) {
      return (
        <div className={classNames(`widget-component-container`, styles.widgetComponentContainer)}>
          <WidgetMessageMeet accessToken={this.state.accessToken} toPersonEmail={this.state.toPersonEmail} />
        </div>);
    }
    return (
      <div className={classNames(`demo-wrapper`, styles.demoWrapper)}>
        <div className={classNames(`logo`, styles.logo)}>
          <SparkLogo />
        </div>
        { !this.state.hasToken &&
          <DemoLogin onLogin={this.handleAccessTokenChange} />
        }
        {
          this.state.hasToken &&
            <div className={classNames(styles.toForm)}>
              <div className={classNames(styles.header)}>
                <div>
                  <TextField
                    floatingLabelFixed
                    floatingLabelText="To User Email"
                    hintText="Spark User Email"
                    onChange={this.handleEmailChange}
                    value={this.state.toPersonEmail}
                  />
                </div>
                <div>
                  <RaisedButton
                    disabled={!loadButtonEnabled}
                    label={`Open Widget`}
                    onClick={this.handleSubmit}
                    primary
                  />
                  <RaisedButton
                    disabled={!this.state.accessToken}
                    label={`Clear Token`}
                    onClick={this.handleClearToken}
                    secondary
                  />
                </div>
              </div>
              <div className={classNames(styles.example)}>
                <Tabs>
                  <Tab label={`React Component`}>
                    <div className={classNames(`example-code`, styles.exampleCode)}>
                      <ExampleCode accessToken={this.state.accessToken} toPersonEmail={this.state.toPersonEmail} type={MODE_REACT} />
                    </div>
                  </Tab>
                  <Tab label={`Inline Mode`}>
                    <div className={classNames(`example-code`, styles.exampleCode)}>
                      <ExampleCode accessToken={this.state.accessToken} toPersonEmail={this.state.toPersonEmail} type={MODE_INLINE} />
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
        }
      </div>
    );
  }
}

DemoWidgetMessageMeet.title = `Widget Message Meet`;
DemoWidgetMessageMeet.path = `/wmm-demo`;

export default DemoWidgetMessageMeet;
