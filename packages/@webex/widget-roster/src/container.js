import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {bindActionCreators} from 'redux';
import classNames from 'classnames';
import {autobind} from 'core-decorators';
import {debounce} from 'lodash';
import isEmail from 'validator/lib/isEmail';

import {fetchAvatarsForUsers} from '@webex/redux-module-avatar';
import {addParticipantToConversation, removeParticipantFromConversation} from '@webex/redux-module-conversation';
import {searchForUser} from '@webex/redux-module-search';
import LoadingScreen from '@webex/react-component-loading-screen';
import wrapConversationMercury from '@webex/react-hoc-conversation-mercury';
import PeopleList from '@webex/react-component-people-list';
import ActivityMenuHeader from '@webex/react-component-activity-menu-header';

import {Button, Icon} from '@momentum-ui/react';

import {getRosterWidgetProps} from './selector';
import {setSearchTerm, setWidgetViewAdd, setWidgetViewMain, VIEW_ADD} from './actions';
import messages from './messages';
import styles from './styles.css';
import AddParticipant from './components/add-participant';
import ExternalParticipantMessage from './components/external-participant';

/**
 * RosterWidget Container
 * @extends Component
 */
export class RosterWidget extends Component {
  constructor(props) {
    super(props);
    this.doSearch = debounce(this.doSearch, 1000);
    const {formatMessage} = props.intl;

    this.formattedMessages = {
      addPeople: formatMessage(messages.addPeople),
      addPlaceholder: formatMessage(messages.addPlaceholder),
      cancelDetails: formatMessage(messages.cancelDetails),
      externalParticipants: formatMessage(messages.externalParticipants),
      moderators: formatMessage(messages.moderators),
      noResults: formatMessage(messages.noResults),
      participants: formatMessage(messages.participants),
      removeParticipant: formatMessage(messages.removeParticipant)
    };
  }


  shouldComponentUpdate(nextProps) {
    return nextProps.avatar.get('items') !== this.props.avatar.get('items')
      || nextProps.conversation.get('participants') !== this.props.conversation.get('participants')
      || nextProps.canEditRoster !== this.props.canEditRoster
      || nextProps.currentView !== this.props.widgetRoster.currentView
      || nextProps.searchResults !== this.props.searchResults;
  }

  componentWillUpdate(nextProps) {
    // Fetch avatars for searched users
    if (nextProps.searchResults
      && nextProps.searchResults !== this.props.searchResults
      && nextProps.searchResults.results
    ) {
      this.props.fetchAvatarsForUsers(nextProps.searchResults.results.map((user) => user.id), this.props.sparkInstance);
    }
  }

  @autobind
  displayUsers(users) {
    this.props.fetchAvatarsForUsers(users, this.props.sparkInstance);
  }

  @autobind
  handleMenuClick() {
    this.props.onClickMenu();
  }

  @autobind
  handleCloseClick() {
    this.props.onClickClose();
  }

  @autobind
  handleAddPeople() {
    this.props.setWidgetViewAdd();
  }

  @autobind
  handleAddPeopleDismiss() {
    this.props.setWidgetViewMain();
  }

  @autobind
  handleAddPersonClick(person) {
    this.props.setWidgetViewMain();
    this.props.addParticipantToConversation(this.props.conversation, person, this.props.sparkInstance);
  }

  @autobind
  handleSearchInput(searchTerm) {
    this.props.setSearchTerm(searchTerm);
    // Consumer org can only search via email
    if (this.props.isConsumerOrg && isEmail(searchTerm) || !this.props.isConsumerOrg && searchTerm.length >= 3) {
      this.doSearch(searchTerm);
    }
  }

  @autobind
  handleRosterRemove(participant) {
    this.props.removeParticipantFromConversation(this.props.conversation, participant, this.props.sparkInstance);
  }

  @autobind
  doSearch(searchTerm) {
    // Only actually search if we don't have search results for the term
    if (searchTerm === this.props.searchTerm && !this.props.searchResults) {
      this.props.searchForUser(searchTerm, this.props.sparkInstance);
    }
  }

  /**
   * Renders the main area of the widget
   *
   * @returns {object}
   */
  render() {
    let mainArea;
    const {
      activityTypes,
      canEditRoster,
      participants
    } = this.props;

    if (!this.props.conversation.has('participants')) {
      mainArea = <LoadingScreen />;
    }
    else {
      const {
        currentView,
        searchResults,
        searchTerm
      } = this.props;
      let content;

      if (currentView === VIEW_ADD) {
        content = (
          <div className={classNames('webex-roster-add-participant-list', styles.fullHeight)}>
            <AddParticipant
              noResultsMessage={this.formattedMessages.noResults}
              onAddPerson={this.handleAddPersonClick}
              onChange={this.handleSearchInput}
              onDismiss={this.handleAddPeopleDismiss}
              placeholder={this.formattedMessages.addPlaceholder}
              searchResults={searchResults}
              searchTerm={searchTerm}
            />
          </div>
        );
      }
      else {
        let addPeopleButton;

        if (canEditRoster) {
          addPeopleButton = (
            // eslint-disable-reason false positive until a11y plugin upgraded to ^5.0
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              className={classNames('webex-roster-add-people', styles.addPeople)}
              onClick={this.handleAddPeople}
              onKeyPress={this.handleAddPeople}
              role="button"
              tabIndex="0"
            >
              <div className={classNames(styles.addPeopleIcon)}>
                <Button
                  ariaLabel={this.formattedMessages.addPeople}
                  circle
                  color="blue"
                  size={28}
                >
                  <Icon name="icon-plus_12" color="white" />
                </Button>
              </div>
              <div>
                {this.formattedMessages.addPeople}
              </div>
            </div>
          );
        }
        content = (
          <div className={classNames('webex-roster-people-list', styles.fullHeight)}>
            {addPeopleButton}
            <PeopleList
              canEdit={canEditRoster}
              items={participants.people}
              onDisplayUsers={this.displayUsers}
              onPersonRemove={this.handleRosterRemove}
            />
          </div>
        );
      }

      mainArea = (
        <div className={classNames('webex-roster-main-area-participants', styles.fullHeight)}>
          {
            participants.hasExternalParticipants
            && <ExternalParticipantMessage message={this.formattedMessages.externalParticipants} />
          }
          {content}
        </div>
      );
    }

    return (
      <div className={classNames('webex-roster', styles.roster)}>
        <ActivityMenuHeader
          activityTypes={activityTypes}
          onClose={this.props.onClickClose && this.handleCloseClick}
          onMenuClick={this.props.onClickMenu && this.handleMenuClick}
          title={`People (${participants.count ? participants.count : null})`}
        />
        <div className={classNames('webex-roster-main-area', styles.fullHeight)}>
          {mainArea}
        </div>
      </div>
    );
  }
}

const injectedPropTypes = {
  activityTypes: PropTypes.array.isRequired,
  canEditRoster: PropTypes.bool.isRequired,
  conversation: PropTypes.object.isRequired,
  currentView: PropTypes.string.isRequired,
  isConsumerOrg: PropTypes.bool.isRequired,
  participants: PropTypes.shape({
    hasExternalParticipants: PropTypes.bool.isRequired,
    people: PropTypes.array,
    count: PropTypes.number.isRequired
  }),
  searchResults: PropTypes.object,
  searchTerm: PropTypes.string,
  sparkInstance: PropTypes.object,
  widgetRoster: PropTypes.object.isRequired,
  addParticipantToConversation: PropTypes.func.isRequired,
  fetchAvatarsForUsers: PropTypes.func.isRequired,
  removeParticipantFromConversation: PropTypes.func.isRequired,
  searchForUser: PropTypes.func.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  setWidgetViewAdd: PropTypes.func.isRequired,
  setWidgetViewMain: PropTypes.func.isRequired
};

export const ownPropTypes = {
  onClickClose: PropTypes.func,
  onClickMenu: PropTypes.func,
  onEvent: PropTypes.func,
  spaceId: PropTypes.string,
  eventNames: PropTypes.object
};

RosterWidget.propTypes = {
  ...ownPropTypes,
  ...injectedPropTypes
};

export default compose(
  wrapConversationMercury,
  connect(
    getRosterWidgetProps,
    (dispatch) => bindActionCreators({
      addParticipantToConversation,
      fetchAvatarsForUsers,
      removeParticipantFromConversation,
      searchForUser,
      setSearchTerm,
      setWidgetViewAdd,
      setWidgetViewMain
    }, dispatch)
  )
)(RosterWidget);
