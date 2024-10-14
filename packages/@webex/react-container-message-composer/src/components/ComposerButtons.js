/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import uuid from 'uuid';

import {Button, Icon} from '@momentum-ui/react';

import styles from './ComposerButtons.css';

function ComposerButtons({onAttachFile, composerActions}) {
  const inputId = `messageFileInput-${uuid.v4()}`;
  const fileRef = React.createRef();

  function handleClick() {
    fileRef.current?.click();
  }

  return (
    (
      composerActions.attachFiles &&
      <div className={classNames('webex-message-composer-buttons', styles.buttonsArea)}>
        <Button
          circle
          onClick={handleClick}
          size={32}
          removeStyle
        >
          <input
            ref={fileRef}
            className={classNames('webex-file-input', styles.fileInput)}
            id={inputId}
            multiple="multiple"
            onChange={onAttachFile}
            type="file"
          />
          <label htmlFor={inputId}>
            <Icon
              ariaLabel="Attach Files"
              name="attachment_16"
            />
          </label>
        </Button>
      </div>
    ) || null
  );
}

ComposerButtons.propTypes = {
  onAttachFile: PropTypes.func,
  composerActions: PropTypes.shape({
    attachFiles: PropTypes.bool
  }).isRequired
};

ComposerButtons.defaultProps = {
  onAttachFile: () => {}
};

export default ComposerButtons;
