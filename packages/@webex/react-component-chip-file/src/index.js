import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ChipBase from '@webex/react-component-chip-base';

import {Icon} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  thumbnail: PropTypes.string
};

const defaultProps = {
  size: '',
  thumbnail: ''
};


function ChipFile(props) {
  const {
    name,
    size,
    thumbnail
  } = props;
  let icon;

  if (!thumbnail) {
    icon = (
      <div className={classNames('webex-file-icon', styles.icon)}>
        <Icon name="icon-document_36" />
      </div>
    );
  }

  return (
    <ChipBase {...props}>
      <div className={classNames('webex-file-thumbnail', styles.thumbnail)}>
        {icon}
        <img alt="" src={thumbnail} />
      </div>
      <div className={classNames('webex-file-info', styles.info)}>
        <div className={classNames('webex-file-name', styles.name)}>{name}</div>
        <div className={classNames('webex-file-meta', styles.meta)}>
          <div className={classNames('webex-file-size', styles.size)}>{size}</div>
        </div>
      </div>
    </ChipBase>
  );
}

ChipFile.propTypes = propTypes;
ChipFile.defaultProps = defaultProps;

export default ChipFile;
