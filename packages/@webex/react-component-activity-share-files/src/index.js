import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import connectFileDownloader from '@webex/react-container-file-downloader';
import ActivityItemBase from '@webex/react-component-activity-item-base';
import ActivityText from '@webex/react-component-activity-text';
import FileShareDisplay from '@webex/react-component-file-share-display';
import AdaptiveCard from '@webex/react-component-adaptive-card';
import {CARD_CONTAINS_IMAGE} from '@webex/react-component-utils';

import styles from './styles.css';

const propTypes = {
  actor: PropTypes.shape({
    displayName: PropTypes.string
  }).isRequired,
  content: PropTypes.string,
  displayName: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.shape({
      url: PropTypes.string
    }),
    thumbnail: PropTypes.string,
    mimeType: PropTypes.string,
    url: PropTypes.string
  })).isRequired,
  isPending: PropTypes.bool,
  onDownloadClick: PropTypes.func.isRequired,
  share: PropTypes.object.isRequired,
  timestamp: PropTypes.string.isRequired,
  renderAdaptiveCard: PropTypes.bool,
  cards: PropTypes.array,
  sdkInstance: PropTypes.object.isRequired,
  verb: PropTypes.string,
  activityId: PropTypes.string,
  intl: PropTypes.object.isRequired
};

const defaultProps = {
  content: '',
  displayName: '',
  isPending: false,
  renderAdaptiveCard: false,
  cards: [],
  verb: '',
  activityId: undefined
};

export function ActivityShareFiles(props) {
  const {
    actor,
    content,
    displayName,
    files,
    isPending,
    onDownloadClick,
    share,
    timestamp,
    cards,
    renderAdaptiveCard,
    sdkInstance,
    verb,
    activityId,
    intl
  } = props;

  const items = files.map((file) => {
    let objectUrl;
    let isFetching = true;

    if (file.image && file.type !== CARD_CONTAINS_IMAGE) {
      if (isPending) {
        objectUrl = file.thumbnail;
        isFetching = false;
      }
      else {
        const thumbnail = file.mimeType === 'image/gif' ? share.getIn(['files', file.url]) : share.getIn(['files', file.image.url]);

        if (thumbnail) {
          isFetching = thumbnail.get('isFetching');
          objectUrl = thumbnail.get('objectUrl');
        }
      }
    }

    if (file.type !== CARD_CONTAINS_IMAGE) {
      return (
        <FileShareDisplay
          actor={actor}
          file={file}
          isFetching={isFetching}
          isPending={isPending}
          key={file.url}
          objectUrl={objectUrl}
          onDownloadClick={onDownloadClick}
          type="chat"
          timestamp={timestamp}
        />
      );
    }

    return '';
  });

  let textItem;

  if (!renderAdaptiveCard && (content || displayName)) {
    textItem = <ActivityText content={content} displayName={displayName} />;
  }

  return (
    <ActivityItemBase {...props}>
      <div className={classNames('webex-activity-share-list', styles.shareList)}>
        {renderAdaptiveCard && <AdaptiveCard
          cards={cards}
          displayName={displayName}
          items={files}
          verb={verb}
          share={share}
          sdkInstance={sdkInstance}
          activityId={activityId}
          intl={intl}
        />}
        {items}
        {textItem}
      </div>
    </ActivityItemBase>
  );
}

ActivityShareFiles.propTypes = propTypes;
ActivityShareFiles.defaultProps = defaultProps;

export default connectFileDownloader(ActivityShareFiles);
