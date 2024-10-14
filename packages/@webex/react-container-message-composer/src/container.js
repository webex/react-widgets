import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames';
import {debounce} from 'lodash';
import {autobind} from 'core-decorators';
import {
  MentionsInput,
  Mention
} from 'react-mentions';
import {
  addFiles,
  removeFile,
  setUserTyping,
  submitActivity,
  storeActivityText
} from '@webex/redux-module-activity';
import {searchForUser} from '@webex/redux-module-search';
import PresenceAvatar from '@webex/react-container-presence-avatar';
import FileStagingArea from '@webex/react-component-file-staging-area';
import {constructFiles, checkMaxFileSize} from '@webex/react-component-utils';
import {Icon} from '@momentum-ui/react';
import {addError, removeError} from '@webex/redux-module-errors';

import ComposerButtons from './components/ComposerButtons';

import {blurTextArea, focusTextArea} from './actions';
import styles from './styles.css';
import mentionStyles from './mentions.css';

const injectedPropTypes = {
  activity: PropTypes.object.isRequired,
  avatar: PropTypes.object.isRequired,
  conversation: PropTypes.object.isRequired,
  sparkInstance: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  messageComposer: PropTypes.object.isRequired,
  addFiles: PropTypes.func.isRequired,
  blurTextArea: PropTypes.func.isRequired,
  focusTextArea: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired,
  setUserTyping: PropTypes.func.isRequired,
  submitActivity: PropTypes.func.isRequired,
  searchForUser: PropTypes.func.isRequired,
  storeActivityText: PropTypes.func.isRequired,
  addError: PropTypes.func.isRequired,
  removeError: PropTypes.func.isRequired
};

const propTypes = {
  composerActions: PropTypes.shape({
    attachFiles: PropTypes.bool
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  showMentions: PropTypes.bool,
  showSubmitButton: PropTypes.bool,
  sendMessageOnReturnKey: PropTypes.bool,
  ...injectedPropTypes
};

const defaultProps = {
  placeholder: '',
  showMentions: false,
  showSubmitButton: false,
  sendMessageOnReturnKey: true
};


export class MessageComposer extends Component {
  constructor(props) {
    super(props);
    this.timerId = 0;
    this.setUserStartTyping = debounce(this.setUserStartTyping, 500, {leading: true, trailing: false});
  }

  shouldComponentUpdate(nextProps) {
    const {props} = this;

    return props.activity !== nextProps.activity || props.placeholder !== nextProps.placeholder;
  }

  @autobind
  setUserTyping(state) {
    const {props} = this;
    const {
      conversation,
      sparkInstance
    } = props;

    props.setUserTyping(state, conversation, sparkInstance);
  }

  @autobind
  setUserStopTyping() {
    this.setUserTyping(false);
  }

  setUserStartTyping() {
    this.setUserTyping(true);
  }

  @autobind
  handleTextChange(e, newValue, newValuePlainText) {
    const {props} = this;
    let {value} = e.target;

    if (newValue && newValue.length) {
      value = newValue;
    }
    props.storeActivityText(value, newValuePlainText);

    clearTimeout(this.timerId);
    if (value === '') {
      this.setUserTyping(false);
    }
    else {
      if (!props.activity.getIn(['status', 'isTyping'])) {
        this.setUserStartTyping();
      }
      this.timerId = setTimeout(this.setUserStopTyping, 3000);
    }
  }

  @autobind
  handleKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      if (this.props.sendMessageOnReturnKey) {
        this.handleSubmit();
        e.preventDefault();
      }
    }
  }

  @autobind
  handleSubmit() {
    const {props} = this;
    const {
      activity,
      conversation,
      sparkInstance,
      currentUser,
      onSubmit
    } = props;

    if (activity.get('text').trim().length === 0 && activity.get('files').size === 0) {
      return;
    }
    this.setUserTyping(false);
    props.submitActivity(conversation, activity, currentUser, sparkInstance);

    if (typeof onSubmit === 'function') {
      onSubmit();
    }
  }

  @autobind
  handleTextAreaBlur() {
    const {props} = this;
    const {
      conversation,
      sparkInstance
    } = props;

    props.blurTextArea();
    props.setUserTyping(false, conversation, sparkInstance);
  }

  @autobind
  handleTextAreaFocus() {
    this.props.focusTextArea();
  }

  @autobind
  handleAddFile(e) {
    e.stopPropagation();
    e.preventDefault();

    if (e.target.files.length) {
      const {props} = this;
      const {
        activity,
        conversation,
        sparkInstance
      } = props;

      const files = constructFiles(e.target.files);

      if (checkMaxFileSize(files, props.addError, props.removeError)) {
        props.addFiles(conversation, activity, files, sparkInstance);
      }

      // Clear the value of the input so the same file can be added again.
      e.target.value = '';
    }
  }

  @autobind
  handleFileRemove(id) {
    const {props} = this;

    props.removeFile(id, props.activity);
  }

  @autobind
  searchForMention(term) {
    const {
      avatar,
      conversation,
      currentUser
    } = this.props;
    const participants = [];

    if (conversation.has('participants') && conversation.get('participants').count()) {
      conversation.get('participants').toJS().forEach((p) => {
        if (currentUser.id !== p.id) {
          participants.push({
            display: p.displayName,
            id: p.id,
            avatarUrl: avatar.getIn(['items', p.id])
          });
        }
      });

      if (term) {
        return participants.filter((p) => p.display.toLowerCase().includes(term.toLowerCase()));
      }
    }

    return participants;
  }

  static renderSuggestion(entry, search, highlightedDisplay) {
    return (
      <div className={mentionStyles.content}>
        <div className={mentionStyles.avatar}>
          <PresenceAvatar avatarId={entry.id} name={entry.display} size={24} />
        </div>
        <div className={mentionStyles.highlightedDisplay}>
          {highlightedDisplay}
        </div>
      </div>
    );
  }

  render() {
    let text;
    const {props} = this;
    const {
      activity,
      composerActions,
      messageComposer,
      placeholder,
      conversation,
      showSubmitButton
    } = this.props;

    const files = activity.get('files');

    if (activity && activity.has('text')) {
      text = activity.get('text');
    }

    const textAreaFocusStyle = messageComposer.getIn(['status', 'hasTextAreaFocus']) ? styles.hasFocus : '';
    const mentionMarkup = '@{__display__}|__id__|';
    const canSendMessage = !!text;

    // Only show mentions if this is not a one on one convo
    const showMentions = props.showMentions && !conversation.getIn(['status', 'isOneOnOne']);
    const getData = showMentions ? this.searchForMention : () => {};

    return (
      <div className={classNames('webex-message-composer', styles.messageComposer, textAreaFocusStyle)}>
        <ComposerButtons
          composerActions={composerActions}
          onAttachFile={this.handleAddFile}
        />
        {files && files.count() > 0 &&
          <FileStagingArea
            files={files}
            onFileRemove={this.handleFileRemove}
          />
        }
        <div className={classNames('webex-textarea-container', styles.textAreaContainer)}>
          <MentionsInput
            classNames={mentionStyles}
            markup={mentionMarkup}
            onBlur={this.handleTextAreaBlur}
            onChange={this.handleTextChange}
            onFocus={this.handleTextAreaFocus}
            onKeyDown={this.handleKeyDown}
            onSubmit={this.handleSubmit}
            placeholder={placeholder}
            rows={1}
            value={text}
          >
            <Mention
              className={mentionStyles.mentions__mention}
              data={getData}
              renderSuggestion={MessageComposer.renderSuggestion}
              trigger="@"
            />
          </MentionsInput>
          {showSubmitButton &&
            <div className={styles.chatSubmitButtonContainer}>
              <button className={styles.chatSubmitButton} type="submit" onClick={this.handleSubmit} aria-label="Send" disabled={!canSendMessage}>
                <Icon name="icon-send_16" color={canSendMessage ? 'black' : 'gray-20'} />
              </button>
            </div>
          }
        </div>
      </div>
    );
  }
}


MessageComposer.propTypes = propTypes;
MessageComposer.defaultProps = defaultProps;

function mapStateToProps(state, ownProps) {
  return {
    activity: state.activity,
    avatar: state.avatar,
    conversation: state.conversation,
    sparkInstance: ownProps.sparkInstance || state.spark.get('spark'),
    users: state.users,
    messageComposer: state.messageComposer,
    currentUser: state.users.getIn(['byId', state.users.get('currentUserId')])
  };
}

export default connect(
  mapStateToProps,
  (dispatch) => bindActionCreators({
    addFiles,
    blurTextArea,
    focusTextArea,
    removeFile,
    setUserTyping,
    submitActivity,
    searchForUser,
    storeActivityText,
    addError,
    removeError
  }, dispatch)
)(MessageComposer);
