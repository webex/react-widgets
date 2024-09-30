import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {Icon} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  onRemove: PropTypes.func
};

const defaultProps = {
  onRemove: () => {}
};

function ChipBase(props) {
  const {
    children,
    id,
    onRemove
  } = props;

  function handleRemove() {
    onRemove(id);
  }

  return (
    <div className={classNames('webex-chip', styles.chip)}>
      {children}
      <div className={classNames('webex-chip-action', styles.action)}>
        <Icon
          ariaLabel="Delete Share"
          name="icon-cancel_16"
          onClick={handleRemove}
        />
      </div>
    </div>
  );
}

ChipBase.propTypes = propTypes;
ChipBase.defaultProps = defaultProps;

export default ChipBase;
