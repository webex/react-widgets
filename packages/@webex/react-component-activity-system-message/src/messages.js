/*
 * System Message
 *
 * This contains all the text for the ActivitySystemMessage component.
 */
import {defineMessages} from 'react-intl';

export default defineMessages({
  youCreate: {
    id: 'ciscospark.systemMessage.conversation.youCreate',
    defaultMessage: 'You created this conversation.'
  },
  someoneCreate: {
    id: 'ciscospark.systemMessage.conversation.someoneCreate',
    defaultMessage: '{name} created this conversation.'
  },
  youDelete: {
    id: 'ciscospark.systemMessage.message.youDelete',
    defaultMessage: 'You deleted your message.'
  },
  someoneDelete: {
    id: 'ciscospark.systemMessage.message.someoneDelete',
    defaultMessage: '{name} deleted their own message.'
  },
  youAdded: {
    id: 'ciscospark.systemMessage.message.youAdded',
    defaultMessage: 'You added {name} to this space.'
  },
  someoneAdded: {
    id: 'ciscospark.systemMessage.message.youAdded',
    defaultMessage: '{name} was added to this space.'
  },
  youRemoved: {
    id: 'ciscospark.systemMessage.message.youRemoved',
    defaultMessage: 'You removed {name} from this space.'
  },
  someoneRemoved: {
    id: 'ciscospark.systemMessage.message.youRemoved',
    defaultMessage: '{name} was removed from this space.'
  }
});
