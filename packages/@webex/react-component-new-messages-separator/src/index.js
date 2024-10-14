import React from 'react';
import PropTypes from 'prop-types';
import ListSeparator from '@webex/react-component-list-separator';

const propTypes = {
  message: PropTypes.string.isRequired
};

function NewMessageSeparator({message}) {
  return (
    <div>
      <ListSeparator isInformative primaryText={message} />
    </div>
  );
}

NewMessageSeparator.propTypes = propTypes;

export default NewMessageSeparator;
