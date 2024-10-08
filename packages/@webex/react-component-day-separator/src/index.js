import React from 'react';
import PropTypes from 'prop-types';
import ListSeparator from '@webex/react-component-list-separator';

import calculateDateText from './calculateDateText';

const propTypes = {
  // All props are moment.js objects
  fromDate: PropTypes.object.isRequired,
  now: PropTypes.object.isRequired,
  toDate: PropTypes.object.isRequired
};

function DaySeparator({
  fromDate,
  now,
  toDate
}) {
  return (
    <div>
      <ListSeparator primaryText={calculateDateText(fromDate, now, toDate)} />
    </div>
  );
}

DaySeparator.propTypes = propTypes;

export default DaySeparator;
