import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SyntaxHighlighter from 'react-syntax-highlighter';


import './momentum.scss';
import styles from './styles.css';

const propTypes = {
  code: PropTypes.string.isRequired
};

function ExampleCode({code}) {
  return (
    <div className={classNames('webex-example-code', styles.exampleCode)}>
      <SyntaxHighlighter language="javascript">
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

ExampleCode.propTypes = propTypes;

export default ExampleCode;
