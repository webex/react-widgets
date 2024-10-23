import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Button, Input, Radio, RadioGroup, Checkbox} from '@momentum-ui/react';

import './momentum.scss';
import styles from './styles.css';

const propTypes = {
  onLogin: PropTypes.func.isRequired,
  token: PropTypes.string,
  tokenType: PropTypes.string,
  fedramp: PropTypes.bool
};

const defaultProps = {
  token: '',
  tokenType: '',
  fedramp: false
};

function TokenInput(props) {
  const [tokenSaved, setTokenSaved] = useState(!!props.token);
  const [tokenType, setTokenType] = useState(props.tokenType);
  const [userAccessToken, setUserAccessToken] = useState(props.token);
  const [generateSDKInstance, setGenerateSDKInstance] = useState(false);
  const [fedramp, setFedramp] = useState(props.fedramp);

  function handleClearToken() {
    setUserAccessToken('');
    setTokenSaved(false);
    setFedramp(false);
    props.onLogin();
  }

  function handleSaveToken() {
    setTokenSaved(true);
    props.onLogin(userAccessToken, tokenType, generateSDKInstance, fedramp);
  }

  function handleAccessTokenChange(e) {
    setUserAccessToken(e.target.value);
  }

  function handleTypeChange(value) {
    setTokenType(value);
  }

  function handleGenerateSdkInstanceChange(value) {
    setGenerateSDKInstance(value === 'true');
  }

  function handleFedrampChange() {
    setFedramp(!fedramp);
  }

  return (
    <div className={classNames(styles.section)}>
      <div>
        <h2>Webex Access Token</h2>
        <p>Webex Widgets require an access token to identify the current user.</p>
        {!tokenSaved &&
          <div>
            <div>
              <h3>Access Token Type</h3>
              <RadioGroup
                ariaLabel="Choose Access Token Type"
                name="tokenType"
                onChange={handleTypeChange}
                values={[tokenType]}
              >
                <Radio
                  ariaLabel="Type Access Token"
                  htmlId="tokenTypeAccessToken"
                  label="Access Token"
                  value="token"
                />
                <Radio
                  ariaLabel="Type Guest Token"
                  htmlId="tokenTypeGuestToken"
                  label="Guest Token"
                  value="JWT"
                  disabled={fedramp}
                />
              </RadioGroup>
            </div>
            <div>
              <h3>Generate SDK Instance</h3>
              <RadioGroup
                ariaLabel="Should the demo generate an sdk instance?"
                name="generateSDK"
                onChange={handleGenerateSdkInstanceChange}
                values={[generateSDKInstance.toString()]}
              >
                <Radio
                  ariaLabel="Generate SDK Instance"
                  htmlId="generateSDKTrue"
                  label="True"
                  value="true"
                />
                <Radio
                  ariaLabel="Use Widget SDK"
                  htmlId="generateSDKFalse"
                  label="False"
                  value="false"
                />
              </RadioGroup>
            </div>
            <div>
              <h3>FedRAMP</h3>
              <Checkbox
                checked={fedramp}
                htmlId="fedrampCheckbox"
                label="Enabled"
                onChange={handleFedrampChange}
                value="FedRAMP"
              />
            </div>
            <div>
              <Input
                aria-label="Access Token"
                htmlId="accessTokenInput"
                inputSize="medium-12"
                label="Token"
                onChange={handleAccessTokenChange}
                placeholder={tokenType === 'JWT' ? 'JWT' : 'Access Token'}
                value={userAccessToken}
              />
              <p>You can get an access token from <a href="http://developer.webex.com">developer.webex.com</a></p>
            </div>
          </div>
        }
        <div>
          {
            !tokenSaved &&
            <Button
              ariaLabel="Save Token"
              color="blue"
              disabled={!userAccessToken}
              id="accessTokenSaveButton"
              onClick={handleSaveToken}
            >
              Save Token
            </Button>
          }
          {
            tokenSaved &&
            <Button
              ariaLabel="Clear Token"
              color="blue"
              onClick={handleClearToken}
            >
              Token Saved, Clear?
            </Button>
          }
        </div>
      </div>
    </div>
  );
}

TokenInput.propTypes = propTypes;
TokenInput.defaultProps = defaultProps;

export default TokenInput;