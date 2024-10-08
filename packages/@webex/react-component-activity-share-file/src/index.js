import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {bytesToSize, getFileIcon} from '@webex/react-component-utils';

import {Button, Icon} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  file: PropTypes.shape({
    displayName: PropTypes.string,
    fileSize: PropTypes.number,
    mimeType: PropTypes.string,
    objectType: PropTypes.string
  }).isRequired,
  isPending: PropTypes.bool,
  onDownloadClick: PropTypes.func.isRequired
};

const defaultProps = {
  isPending: false
};

function ActivityShareFile(props) {
  const {
    file,
    isPending,
    onDownloadClick
  } = props;

  const {
    displayName,
    fileSize,
    mimeType,
    objectType
  } = file;

  function handleDownloadClick() {
    onDownloadClick(file);
  }

  return (
    <div className={classNames('webex-activity-share-item', styles.shareItem)}>
      <div className={classNames('webex-share-file-icon', styles.fileIcon)}>
        <Icon name={`icon-${getFileIcon(mimeType, 32)}`} />
      </div>
      <div className={classNames('webex-share-meta', styles.meta)}>
        <div className={classNames('webex-share-file-info', styles.fileInfo)}>
          <div className={classNames('webex-share-name', styles.fileName)}>{displayName}</div>
          <div className={classNames('webex-share-file-props', styles.fileProps)}>
            <span className={classNames('webex-share-file-size', styles.fileSize)}>{bytesToSize(fileSize)}</span>
            <span className={classNames('webex-share-file-type', styles.fileType)}>{objectType}</span>
          </div>
        </div>
      </div>
      {
        !isPending &&
        <div className={classNames('webex-share-item-actions', styles.shareActions)}>
          <div className={classNames('webex-share-action-item', styles.shareActionItem)}>
            <Button
              ariaLabel={`Download ${displayName}`}
              style={{backgroundColor: 'black'}}
              circle
              onClick={handleDownloadClick}
              size={32}
            >
              <Icon name="icon-arrow-tail-down_12" color="white" />
            </Button>
          </div>
        </div>
      }
    </div>
  );
}

ActivityShareFile.propTypes = propTypes;
ActivityShareFile.defaultProps = defaultProps;

export default ActivityShareFile;
