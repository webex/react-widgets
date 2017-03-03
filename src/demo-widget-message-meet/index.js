/* eslint-disable react/no-set-state */
import React, {Component} from 'react';
import classNames from 'classnames';
import cookie from 'react-cookie';
import autobind from 'autobind-decorator';

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
    this.state = {
      authenticate: false,
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
    return this.setState({accessToken});
  }

  @autobind
  handleEmailChange(e) {
    return this.setState({toPersonEmail: e.target.value});
  }

  @autobind
  handleModeChange(e) {
    return this.setState({mode: e.target.value});
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
        { !this.state.accessToken &&
          <DemoLogin onLogin={this.handleAccessTokenChange} />
        }
        {
          this.state.accessToken &&
          <form className={classNames(`demo-form`, styles.demoForm)}>
            <div className={classNames(`field-wrapper`, styles.fieldWrapper)}>
              <input
                className={classNames(`field-input`, styles.fieldInput)}
                onChange={this.handleEmailChange}
                placeholder="To User Email"
                type="text"
                value={this.state.toPersonEmail}
              />
            </div>
            <div className={classNames(`field-wrapper`, styles.fieldWrapper)}>
              <div className={classNames(`radio-group`, styles.radioGroup)}>
                <div className={classNames(`radio-item`, styles.radioItem)}>
                  <input
                    checked={this.state.mode === MODE_INLINE}
                    id="radio_inline"
                    onChange={this.handleModeChange}
                    type="radio"
                    value={MODE_INLINE}
                  />
                  <label htmlFor="radio_inline">
                    {`Inline Mode`}
                  </label>
                </div>
                <div className={classNames(`radio-item`, styles.radioItem)}>
                  <input
                    checked={this.state.mode === MODE_REACT}
                    id="radio_react"
                    onChange={this.handleModeChange}
                    type="radio"
                    value={MODE_REACT}
                  />
                  <label htmlFor="radio_react">
                    {`React Component`}
                  </label>
                </div>
              </div>
            </div>
            <div className={classNames(`example-code`, styles.exampleCode)}>
              <ExampleCode accessToken={this.state.accessToken} toPersonEmail={this.state.toPersonEmail} type={this.state.mode} />
            </div>
            <button
              className={classNames(`button`, styles.button)}
              disabled={!loadButtonEnabled}
              onClick={this.handleSubmit}
            >
              {`Open Widget`}
            </button>
          </form>
        }
      </div>
    );
  }
}

DemoWidgetMessageMeet.title = `Widget Message Meet`;
DemoWidgetMessageMeet.path = `/wmm-demo`;

export default DemoWidgetMessageMeet;
