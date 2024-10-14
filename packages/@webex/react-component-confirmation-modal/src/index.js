import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  actionButtonLabel: PropTypes.string,
  body: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  onClickActionButton: PropTypes.func.isRequired,
  onClickCancelButton: PropTypes.func.isRequired,
  title: PropTypes.string
};

const defaultProps = {
  actionButtonLabel: '',
  body: '',
  cancelButtonLabel: '',
  title: ''
};

function ConfirmationModal({
  title,
  actionButtonLabel,
  cancelButtonLabel,
  body,
  onClickActionButton,
  onClickCancelButton
}) {
  const modalClassNames = classNames('webex-dialogue-modal', styles.dialogueModal);

  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const actionBtnClassNames = classNames(
    'dialogue-modal-btn',
    'dialogue-modal-action-btn',
    styles.dialogueModalBtn,
    styles.dialogueModalActionBtn
  );

  const cancelBtnClassNames = classNames(
    'dialogue-modal-btn',
    'dialogue-modal-exit-btn',
    styles.dialogueModalBtn,
    styles.dialogueModalExitBtn
  );

  return (
    <div>
      <div
        ref={modalRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        className={modalClassNames}
      >
        <div className={classNames('webex-dialogue-modal-body', styles.dialogModalBody)}>
          <div className={classNames('webex-dialogue-modal-title-text', styles.dialogueModalTitleText)}>
            {title}
          </div>
          <div className={classNames('webex-dialogue-modal-body-subtext', styles.dialogueModalBodySubtext)}>
            {body}
          </div>
          <button
            className={actionBtnClassNames}
            onClick={onClickActionButton}
            title={actionButtonLabel}
          >
            {actionButtonLabel}
          </button>
          <button
            className={cancelBtnClassNames}
            onClick={onClickCancelButton}
            title={cancelButtonLabel}
          >
            {cancelButtonLabel}
          </button>
        </div>
      </div>
      <div className={classNames('webex-dialogue-modal-backdrop', styles.dialogueModalBackdrop)} />
    </div>
  );
}

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;

export default ConfirmationModal;
