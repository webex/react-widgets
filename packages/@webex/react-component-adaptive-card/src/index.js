import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {getAdaptiveCard, CARD_CONTAINS_IMAGE, replaceIndexWithBlobURL, API_ACTIVITY_VERB, SUCCESS, FAILURE} from '@webex/react-component-utils';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {handleAdaptiveCardSubmitAction} from '@webex/redux-module-conversation';

import './adaptiveCard.scss';
import styles from './styles.css';
import messages from './messages';

class AdaptiveCard extends React.Component {
  constructor(props) {
    super(props);
    this.nodeElement = React.createRef();
    this.addChildNode = this.addChildNode.bind(this);
    this.handleSubmitAction = this.handleSubmitAction.bind(this);
    this.dismissStatusMessage = this.dismissStatusMessage.bind(this);
    this.setupState = this.setupState.bind(this);
    this.cards = this.props.cards;
    this.hasReplacedCard = false;
    this.parentActivityId = null;
    this.state = {
      childNodes: [],
      hasReplacedImagesInJSON: false,
      isCardActionClicked: false
    };
  }

  componentDidMount() {
    if (Object.prototype.hasOwnProperty.call(this, 'nodeElement') && Object.prototype.hasOwnProperty.call(this.nodeElement, 'current')) {
      this.nodeElement.current.appendChild(
        getAdaptiveCard(
          this.cards,
          this.props.displayName,
          this.props.sdkInstance,
          this.addChildNode,
          this.props.activityId,
          this.props.conversation,
          this.handleSubmitAction
        )
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.state.isCardActionClicked &&
      (this.props.conversation.get('cardActionAcknowledgedState') === SUCCESS || this.props.conversation.get('cardActionAcknowledgedState') === FAILURE)
    ) {
      this.dismissStatusMessage();
    }
    if (prevProps !== this.props) {
      if (this.props.verb === API_ACTIVITY_VERB.SHARE) {
        try {
          const decryptedURLs = this.props.items.filter((file) => file.type === CARD_CONTAINS_IMAGE)
            .map((file) => {
              if (file.mimeType.includes('text/html')) {
                return '';
              }

              const thumbnail = file.mimeType === 'image/gif' ? this.props.share.getIn(['files', file.url]) : this.props.share.getIn(['files', file.image.url]);

              if (thumbnail) {
                const objectUrl = thumbnail.get('objectUrl');

                return objectUrl;
              }

              return undefined;
            });
          const cardsObject = JSON.parse(this.props.cards[0]);
          const undefinedUrls = decryptedURLs.filter((file) => file === undefined);

          if (undefinedUrls.length === 0) {
            this.cards[0] = JSON.stringify(replaceIndexWithBlobURL(cardsObject, decryptedURLs));
            if (this.cards[0]) {
              this.setupState();
            }
          }
        }
        catch (error) {
          this.props.sdkInstance.logger.error('Unable render Adaptive Card', error.message);
        }
      }
    }
  }

  componentWillUnmount() {
    this.state.childNodes.forEach((childNode) => {
      ReactDOM.unmountComponentAtNode(childNode);
    });
  }

  /**
   * set state to tohasReplacedImagesInJSON
   * @returns {void}
   */
  setupState() {
    this.setState({hasReplacedImagesInJSON: true});
  }

  /**
   * set state to maintain a list of all the DOM nodes
   * @param {object} childNode
   * @returns {void}
   */
  addChildNode(childNode) {
    this.setState((prevState) => ({childNodes: [...prevState.childNodes, childNode]}));
  }

  /**
   * calls handleAdaptiveCardSubmitAction action when card action is performed
   * @param {string} url
   * @param {object} actionInput
   * @param {string} parentId
   * @param {HTMLElement} btnClicked
   * @returns {void}
   */
  handleSubmitAction(url, actionInput, parentId, btnClicked) {
    this.props.handleAdaptiveCardSubmitAction(url, actionInput, parentId, this.props.sdkInstance, btnClicked);
    this.setState({isCardActionClicked: true});
  }

  /**
   * method used to set the state variables to default state
   * @returns {void}
  */
  dismissStatusMessage() {
    setTimeout(() => {
      this.setState({isCardActionClicked: false});
    }, 2000);
  }

  render() {
    const activityItemMsgClass = classnames('activity-item--adaptive-card');
    const {formatMessage} = this.props.intl;

    if (this.state.hasReplacedImagesInJSON && !this.hasReplacedCard) {
      if (Object.prototype.hasOwnProperty.call(this, 'nodeElement') && Object.prototype.hasOwnProperty.call(this.nodeElement, 'current')) {
        this.nodeElement.current.replaceChild(
          getAdaptiveCard(
            this.cards,
            this.props.displayName,
            this.props.sdkInstance,
            this.addChildNode,
            this.props.activityId,
            this.props.conversation,
            this.handleSubmitAction
          ),
          this.nodeElement.current.firstChild
        );
        this.hasReplacedCard = true;
      }
    }

    return (
      <div>
        <div
          ref={this.nodeElement}
          className={activityItemMsgClass}
        />
        {
        this.state.isCardActionClicked && (this.props.conversation.get('cardActionAcknowledgedState') === FAILURE
        ? (
          <div className={classnames('failed-status-box', styles.failedStatusBox)}>
            <span className={classnames('failed-error-text', styles.failedErrorText)}>{formatMessage(messages.unableToSendYourRequest)}</span>
          </div>
        )
        : (
          <p className={classnames('status-box', styles.pendingStatusBox)}>
            <span className={classnames('status-text', styles.pendingStatusText)}>
              {this.props.conversation.get('cardActionAcknowledgedState') === SUCCESS
                  ? formatMessage(messages.sent)
                  : formatMessage(messages.sending)}
            </span>
          </p>
        )
        )
       }
      </div>
    );
  }
}

const injectedPropTypes = {
  handleAdaptiveCardSubmitAction: PropTypes.func.isRequired
};

AdaptiveCard.propTypes = {
  cards: PropTypes.array,
  displayName: PropTypes.string,
  sdkInstance: PropTypes.object,
  verb: PropTypes.string,
  items: PropTypes.array,
  share: PropTypes.object,
  conversation: PropTypes.object,
  activityId: PropTypes.string,
  intl: PropTypes.object.isRequired,
  ...injectedPropTypes
};

AdaptiveCard.defaultProps = {
  cards: [],
  displayName: '',
  sdkInstance: {},
  verb: '',
  items: [],
  share: {},
  conversation: {},
  activityId: ''
};

export default connect(
  (state) => ({
    conversation: state.conversation
  }),
  (dispatch) => bindActionCreators({
    handleAdaptiveCardSubmitAction
  }, dispatch)
)(AdaptiveCard);
