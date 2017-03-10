/* eslint-disable react/no-set-state, react/jsx-no-literals */
import React, {Component, PropTypes} from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';

import SparkOAuth from '@ciscospark/react-component-spark-oauth';

import styles from './styles.css';


class DemoLogin extends Component {
  constructor(props) {
    super(props);
    const l = window.location;
    const redirectUri = `${l.protocol}//${l.host}${l.pathname}`.replace(/\/$/, ``);
    const clientId = process.env.MESSAGE_DEMO_CLIENT_ID;
    const clientSecret = process.env.MESSAGE_DEMO_CLIENT_SECRET;
    this.state = {
      authenticate: false,
      clientId,
      clientSecret,
      scope: `spark:kms spark:rooms_read spark:rooms_write spark:memberships_read spark:memberships_write spark:messages_read spark:messages_write`,
      redirectUri,
      userAccessToken: ``
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.authenticate !== this.state.authenticate || nextState.userAccessToken !== this.state.userAccessToken;
  }

  @autobind
  handleLoginOAuth(e) {
    e.preventDefault();
    this.setState({authenticate: true});
  }

  @autobind
  handleOnAuth(token) {
    return this.setState({accessToken: token, authenticate: false}, () => {
      this.props.onLogin(this.state.userAccessToken);
    });
  }

  @autobind
  handleSaveToken(e) {
    e.preventDefault();
    this.props.onLogin(this.state.userAccessToken);
  }

  @autobind
  handleAccessTokenChange(e) {
    return this.setState({userAccessToken: e.target.value});
  }

  render() {
    return (
      <div className={classNames(`ciscospark-demo-login`, styles.demoLogin)}>
        <div className={classNames(styles.header)}>
          <p>{`Spark Widgets require an access token to identify the current user.`}</p>
          <p>
            In this demo, you have two options for getting your access token: manually and oauth.
          </p>
        </div>
        <div className={classNames(styles.menu)}>
          <Tabs>
            <Tab label={`Manual Access Token`}>
              <div className={classNames(styles.content)}>
                <form className={classNames(`ciscospark-demo-form`, styles.demoForm)}>
                  <div className={classNames(`ciscospark-field-wrapper`, styles.fieldWrapper)}>
                    <input
                      className={classNames(`ciscospark-field-input`, styles.fieldInput)}
                      onChange={this.handleAccessTokenChange}
                      placeholder="Your Access Token"
                      type="text"
                      value={this.state.userAccessToken}
                    />
                    <RaisedButton
                      label={`Save`}
                      onClick={this.handleSaveToken}
                    />
                  </div>
                </form>
                <p>You can get access token from <a href="http://developer.ciscospark.com">{`developer.ciscospark.com`}</a></p>
              </div>
            </Tab>
            <Tab label={`Authorize via OAuth`}>
              <div className={classNames(styles.content)}>
                <RaisedButton
                  label={`Authorize with Spark`}
                  onClick={this.handleLoginOAuth}
                />
                <p>{`Authorize with Cisco Spark and acquire the token via OAuth`}</p>
              </div>
            </Tab>
          </Tabs>
        </div>
        <SparkOAuth
          clientId={this.state.clientId}
          clientSecret={this.state.clientSecret}
          doAuth={this.state.authenticate}
          onAuth={this.handleOnAuth}
          redirectUri={this.state.redirectUri}
          scope={this.state.scope}
        />
      </div>
    );
  }
}

DemoLogin.propTypes = {
  onLogin: PropTypes.func.isRequired
};

export default DemoLogin;
