import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {API_ACTIVITY_TYPE, API_ACTIVITY_VERB, getDisplayName} from '@webex/react-component-utils';
import {
  addParticipant,
  receiveMercuryActivity,
  receiveMercuryComment,
  removeParticipant,
  updateConversationState
} from '@webex/redux-module-conversation';

const IS_LISTENING = 'isListeningToMercury';

export default function wrapConversationMercury(WrappedComponent) {
  const injectedPropTypes = {
    addParticipant: PropTypes.func.isRequired,
    conversation: PropTypes.object.isRequired,
    mercury: PropTypes.object.isRequired,
    receiveMercuryActivity: PropTypes.func.isRequired,
    receiveMercuryComment: PropTypes.func.isRequired,
    removeParticipant: PropTypes.func.isRequired,
    spark: PropTypes.object.isRequired,
    updateConversationState: PropTypes.func.isRequired
  };

  class ConversationMercuryComponent extends Component {
    componentDidMount() {
      this.listenToMercury(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.listenToMercury(nextProps);
    }

    shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    }

    listenToMercury(props) {
      const {mercury, conversation, spark} = props;
      const mecuryConnected = mercury.getIn(['status', 'connected']);
      const conversationId = conversation.get('id');
      const isListening = conversation.getIn(['status', IS_LISTENING]);

      if (mecuryConnected && conversationId && !isListening) {
        this.listenToNewActivity(conversationId, spark);
        const conversationState = {};

        conversationState[IS_LISTENING] = true;
        this.props.updateConversationState(conversationState);
      }
    }

    /**
     * Setup listeners for new activities
     *
     * @param {String} conversationId
     * @param {Object} sparkInstance
     * @returns {undefined}
     */
    listenToNewActivity(conversationId, sparkInstance) {
      sparkInstance.internal.mercury.on('event:conversation.activity', (event) => {
        const activity = Object.assign({alertType: event.alertType}, event.data.activity);

        // Reply activities are not currently supported
        if (activity.type === API_ACTIVITY_TYPE.REPLY) {
          return;
        }

        // Ignore activity from other conversations
        if (activity.target && activity.target.id === conversationId) {
          if (activity.object.objectType === 'activity') {
            this.props.receiveMercuryActivity(activity);
          }
          else if (activity.object.objectType === 'person') {
            if (activity.verb === API_ACTIVITY_VERB.ADD) {
              this.props.addParticipant(activity.object);
            }
            else if (activity.verb === API_ACTIVITY_VERB.LEAVE) {
              this.props.removeParticipant(activity.object);
            }
            this.props.receiveMercuryComment(activity);
          }
          else {
            this.props.receiveMercuryComment(activity);
          }
        }
      });
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  ConversationMercuryComponent.displayName = `ConversationMercuryComponent(${getDisplayName(WrappedComponent)})`;
  ConversationMercuryComponent.WrappedComponent = WrappedComponent;

  ConversationMercuryComponent.propTypes = injectedPropTypes;

  return connect(
    (state) => ({
      conversation: state.conversation,
      mercury: state.mercury,
      spark: state.spark.get('spark')
    }),
    (dispatch) => bindActionCreators({
      addParticipant,
      receiveMercuryActivity,
      receiveMercuryComment,
      removeParticipant,
      updateConversationState
    }, dispatch)
  )(ConversationMercuryComponent);
}
