import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './NoSpaces.css';

const propTypes = {
  title: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired
};

function NoSpaces(props) {
  const {
    title,
    emptyMessage
  } = props;

  return (
    <div className={classNames('webex-recents-widget-no-spaces', styles.noSpacesWrapper)}>
      <div className={classNames('webex-no-spaces-img', styles.noSpacesImg)}>
        <svg width="80px" height="62px" viewBox="0 0 80 62" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <defs />
          <g id="Illustrations" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Artboard" transform="translate(-1053.000000, -175.000000)" fill="#FFFFFF">
              <g id="No-Space" transform="translate(1053.000000, 175.000000)">
                <path d="M56.999,0 C44.297,0 34,10.297 34,22.999 C34,26.583 34.82,29.975 36.282,32.998 L37.822,32.998 L56.5,32.998 C56.775,32.998 57,33.223 57,33.498 C57,33.773 56.775,33.998 56.5,33.998 L38.353,33.998 L36.797,33.998 C40.697,41.147 48.281,45.998 56.999,45.998 C69.701,45.998 79.998,35.701 79.998,22.999 C79.998,10.297 69.701,0 56.999,0" id="fill" opacity="0.400000006" />
                <path d="M29,33 L29,5.5 C29,5.225 28.775,5 28.5,5 C28.225,5 28,5.225 28,5.5 L28,33 L0.5,33 C0.225,33 0,33.225 0,33.5 C0,33.775 0.225,34 0.5,34 L28,34 L28,61.5 C28,61.775 28.225,62 28.5,62 C28.775,62 29,61.775 29,61.5 L29,34 L36.797,34 C36.617,33.671 36.445,33.338 36.282,33 L29,33 Z" id="fill" />
              </g>
            </g>
          </g>
        </svg>
      </div>
      <h2 className={classNames('webex-no-spaces-title', styles.noSpacesTitle)}>{title}</h2>
      <div className={classNames('webex-no-spaces-message', styles.noSpacesMessage)}>{emptyMessage}</div>
    </div>
  );
}

NoSpaces.propTypes = propTypes;

export default NoSpaces;
