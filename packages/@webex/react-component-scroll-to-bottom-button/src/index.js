import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@webex/react-component-button';
import Icon, {ICONS} from '@webex/react-component-icon';

import styles from './styles.css';

const propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

const defaultProps = {
  label: ''
};


function ScrollToBottomButton(props) {
  const {
    onClick,
    label
  } = props;

  let containerStyle, labelSpan;

  if (label) {
    labelSpan = <span className={classNames('webex-scroll-to-bottom-label', styles.label)}>{label}</span>;
    containerStyle = styles.withText;
  }

  return (
    <div className={classNames('webex-scroll-to-bottom-container', styles.container, containerStyle)}>
      <Button onClick={onClick}>
        <div className={classNames('webex-scroll-to-bottom-icon', styles.icon)}>
          <Icon type={ICONS.ICON_TYPE_RIGHT_ARROW} />
        </div>
        {labelSpan}
      </Button>
    </div>
  );
}

ScrollToBottomButton.propTypes = propTypes;
ScrollToBottomButton.defaultProps = defaultProps;

export default ScrollToBottomButton;
