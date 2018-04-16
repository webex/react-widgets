import {assert} from 'chai';

import MessageWidget from './messaging';

export const FEATURE_FLAG_ROSTER = 'js-widgets-roster';

export default class RosterWidgetPage extends MessageWidget {
  get hasRosterList() { return this.browser.isVisible(this.elements.rosterList); }

  get hasCloseButton() { return this.browser.isVisible(this.elements.closeButton); }

  get hasAddPeopleButton() { return this.browser.isVisible(this.elements.addPeopleButton); }

  get hasAddParticipant() { return this.browser.isVisible(this.elements.addParticipantArea); }

  get hasSearchInput() { return this.browser.isVisible(this.elements.searchInput); }

  get hasCloseSearchButton() { return this.browser.isVisible(this.elements.closeSearchButton); }

  get participantsList() { return this.browser.getText(this.elements.rosterList); }

  get rosterTitle() { return this.browser.getText(this.elements.rosterTitle); }

  constructor(props) {
    super(props);
    const rosterWidget = '.ciscospark-roster';
    this.elements = Object.assign({}, this.elements, {
      rosterWidget,
      closeButton: `${rosterWidget} button[aria-label="Close"]`,
      peopleButton: `${rosterWidget} button[aria-label="People"]`,
      rosterTitle: `${rosterWidget} .ciscospark-widget-title`,
      participantItem: '.ciscospark-participant-list-item',
      rosterList: '.ciscospark-roster-scrolling-list',
      addParticipantArea: '.ciscospark-roster-add-participant',
      addParticipantResultsArea: '.ciscospark-roster-add-participant-results',
      addParticipantResultItem: '.ciscospark-roster-add-participant-results .ciscospark-people-list-item',
      addParticipantResultName: '.ciscospark-roster-add-participant-results .ciscospark-people-list-name',
      addPeopleButton: '.ciscospark-roster-add-people',
      searchInput: '.ciscospark-roster-add-participant-search-input',
      closeSearchButton: `${rosterWidget} button[aria-label="Close Search"]`
    });
  }

  closeRoster() {
    if (this.hasCloseButton) {
      this.browser.click(this.elements.closeButton);
    }
    browser.waitUntil(() =>
      !this.hasRosterList,
    5000, 'could not close roster widget');
  }

  openSearch() {
    const {
      browser: aBrowser,
      elements
    } = this;

    this.openRoster();
    assert.isTrue(this.hasAddPeopleButton, 'add people button is not visible');
    aBrowser.click(elements.addPeopleButton);
    browser.waitUntil(() =>
      this.hasAddParticipant,
    1000, 'failed to load add participants area');
    assert.isTrue(this.hasSearchInput, 'does not have participant search input');
  }

  closeSearch() {
    if (this.hasAddParticipant) {
      assert.isTrue(this.hasCloseSearchButton, 'does not have a close search button');
      this.browser.click(this.elements.closeSearchButton);
    }
    browser.waitUntil(() =>
      !this.hasAddParticipants,
    5000, 'close button is not hiding search');
  }

  hasParticipants(participants) {
    browser.waitUntil(() =>
      this.hasRosterList,
    5000, 'roster list is not visible');
    const {participantsList} = this;
    return participants.map((participant) =>
      assert.isTrue(participantsList.includes(participant.displayName)));
  }

  canSearchForParticipants() {
    this.openSearch();
    this.closeSearch();
  }

  searchForPerson({
    searchString, doAdd = false, searchResult = searchString
  }) {
    const {
      browser: aBrowser,
      elements
    } = this;
    this.openSearch();
    aBrowser.setValue(elements.searchInput, searchString);
    aBrowser.waitForVisible(elements.addParticipantResultsArea);
    aBrowser.waitForVisible(elements.addParticipantResultItem);
    const resultsText = aBrowser.getText(elements.addParticipantResultName);
    assert.isTrue(resultsText.includes(searchResult), 'matching search result is not found in results');
    if (doAdd) {
      aBrowser.click(elements.addParticipantResultItem);
      // Adding a participant immediately takes you back to roster
      aBrowser.waitForVisible(elements.addPeopleButton, 3000);
    }
    else {
      this.closeSearch();
    }
  }

  searchAndAddPerson({searchString, searchResult}) {
    this.searchForPerson({
      searchString, doAdd: true, searchResult
    });
    browser.waitUntil(() =>
      this.hasRosterList,
    5000, 'roster does not become visible');
    browser.waitUntil(() =>
      this.participantsList.includes(searchResult),
    5000, 'added person not found in participant list');
  }
}
