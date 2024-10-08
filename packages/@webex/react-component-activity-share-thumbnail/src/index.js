import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {bytesToSize, getFileIcon} from '@webex/react-component-utils';
import ShareFile from '@webex/react-component-activity-share-file';

import {
  Button,
  ContentItem,
  Icon
} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  actor: PropTypes.object.isRequired,
  file: PropTypes.shape({
    displayName: PropTypes.string,
    fileSize: PropTypes.number,
    image: PropTypes.object,
    mimeType: PropTypes.string,
    objectType: PropTypes.string
  }).isRequired,
  isFetching: PropTypes.bool,
  isPending: PropTypes.bool,
  objectUrl: PropTypes.string,
  onDownloadClick: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
  type: PropTypes.string
};

const defaultProps = {
  isFetching: false,
  isPending: false,
  objectUrl: '',
  type: 'chat'
};

function ActivityShareThumbnail(props) {
  const {
    actor,
    file,
    isFetching,
    isPending,
    objectUrl,
    onDownloadClick,
    timestamp,
    type
  } = props;

  const {
    displayName,
    fileSize,
    mimeType
  } = file;

  function handleDownloadClick() {
    onDownloadClick(file);
  }

  const actionNode = (
    <div>
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
  );

  const isGif = mimeType === 'image/gif';

  if (type === 'file') {
    return (
      <div className={classNames('webex-activity-share-item', styles.shareItem)}>
        <div className={classNames('webex-share-thumbnail', styles.thumbnail)}>
          <ContentItem
            actionNode={isPending ? '' : actionNode}
            content={objectUrl}
            height={file.image ? file.image.height : null}
            icon={!file.image ? `icon-${getFileIcon(file.mimeType, 72)}` : ''}
            gifIcon={isGif ? 'icon icon-gif_20' : ''}
            fileSize={bytesToSize(fileSize)}
            loading={isFetching}
            loadingText="Loading"
            title={displayName}
            type={type}
            subtitle={`${actor.displayName}, ${timestamp}`}
            width={file.image ? file.image.width : null}
          />
        </div>
      </div>
    );
  }
  if (file.image && type === 'chat') {
    return (
      <ContentItem
        actionNode={isPending ? '' : actionNode}
        content={objectUrl}
        height={file.image.height}
        gifIcon={isGif ? 'icon icon-gif_20' : ''}
        fileSize={bytesToSize(fileSize)}
        loading={isFetching}
        loadingText="Loading"
        title={displayName}
        type={type}
        width={file.image.width}
      />
    );
  }

  return (
    <ShareFile
      file={file}
      isPending={isPending}
      onDownloadClick={onDownloadClick}
    />
  );
}

ActivityShareThumbnail.propTypes = propTypes;
ActivityShareThumbnail.defaultProps = defaultProps;

export default ActivityShareThumbnail;
