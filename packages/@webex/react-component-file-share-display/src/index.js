import React from 'react';
import PropTypes from 'prop-types';

import ShareThumbnail from '@webex/react-component-activity-share-thumbnail';

const defaultProps = {
  isPending: false,
  objectUrl: ''
};

const propTypes = {
  actor: PropTypes.object.isRequired,
  file: PropTypes.shape({
    displayName: PropTypes.string,
    fileSize: PropTypes.number,
    objectType: PropTypes.string
  }).isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPending: PropTypes.bool,
  objectUrl: PropTypes.string,
  onDownloadClick: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

function FileShareDisplay({
  actor,
  file,
  isFetching,
  isPending,
  objectUrl,
  onDownloadClick,
  timestamp,
  type
}) {
  return (
    <ShareThumbnail
      actor={actor}
      file={file}
      isFetching={isFetching}
      isPending={isPending}
      objectUrl={objectUrl}
      onDownloadClick={onDownloadClick}
      timestamp={timestamp}
      type={type}
    />
  );
}

FileShareDisplay.defaultProps = defaultProps;
FileShareDisplay.propTypes = propTypes;

export default FileShareDisplay;
