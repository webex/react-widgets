/*
 * WidgetMessage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import {defineMessages} from 'react-intl';

export default defineMessages({
  newMessagesMessage: {
    id: 'ciscospark.container.message.newMessages.message',
    defaultMessage: 'New Messages'
  },
  deleteAlertTitle: {
    id: 'ciscospark.container.message.deleteAlert.title',
    defaultMessage: 'Delete'
  },
  deleteAlertBody: {
    id: 'ciscospark.container.message.deleteAlert.body',
    defaultMessage: 'Are you sure you want to delete this message?'
  },
  deleteButtonLabel: {
    id: 'ciscospark.container.message.deleteAlert.confirmButton',
    defaultMessage: 'Delete'
  },
  cancelButtonLabel: {
    id: 'ciscospark.container.message.deleteAlert.cancelButton',
    defaultMessage: 'Cancel'
  },
  messageComposerPlaceholder: {
    id: 'ciscospark.container.message.messageComposer.placeholder',
    defaultMessage: 'Send a message to {displayName}'
  },
  dropzoneCoverMessage: {
    id: 'ciscospark.container.message.dropzone.coverMessage',
    defaultMessage: 'Drag and drop your files here'
  },
  errorConversation: {
    id: 'ciscospark.container.message.error.noConversation',
    defaultMessage: 'Conversation Not Available'
  },
  scrollToBottom: {
    id: 'ciscospark.container.message.scrollToBottom',
    defaultMessage: 'Click to scroll to latest messages'
  },
  sharedCards: {
    id: 'ciscospark.container.message.sharedCards',
    defaultMessage: '{cardsLength, plural, =1 {Responded with a card} other {Responded with # cards}}'
  },
  sharedPhotos: {
    id: 'ciscospark.container.message.sharedPhotos',
    defaultMessage: '{imagesLength, plural, =1 {Shared a photo} other {Shared # photos}}'
  }
});
