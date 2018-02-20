import {assert} from 'chai';

export const FEATURE_FLAG_ROSTER = 'js-widgets-roster';

export const elements = {
  rosterWidget: '.ciscospark-roster',
  closeButton: 'button[aria-label="Close"]',
  peopleButton: 'button[aria-label="People"]',
  rosterTitle: '.ciscospark-widget-title',
  participantItem: '.ciscospark-participant-list-item',
  rosterList: '.ciscospark-roster-scrolling-list',
  addParticipantArea: '.ciscospark-roster-add-participant',
  addParticipantResultsArea: '.ciscospark-roster-add-participant-results',
  addParticipantResultItem: '.ciscospark-people-list-item',
  addPeopleButton: '.ciscospark-roster-add-people',
  searchInput: '.ciscospark-roster-add-participant-search-input',
  closeSearchButton: 'button[aria-label="Close Search"]'
};


function openSearch(aBrowser) {
  assert.isTrue(aBrowser.isVisible(elements.rosterWidget), 'roster should be visible for this test');
  assert.isTrue(aBrowser.isVisible(elements.addPeopleButton), 'add people button is not visible');
  aBrowser.click(elements.addPeopleButton);
  aBrowser.waitForVisible(elements.addParticipantArea);
  assert.isTrue(aBrowser.isVisible(elements.searchInput), 'does not have participant search input');
}

function closeSearch(aBrowser) {
  assert.isTrue(aBrowser.isVisible(elements.closeSearchButton), 'does not have a close search button');
  aBrowser.click(elements.closeSearchButton);
  assert.isFalse(aBrowser.isVisible(elements.addParticipantArea), 'close button is not hiding search');
}


/**
 * Verifies that participants are listed by display name
 * @param {Object} aBrowser
 * @param {Array} participants
 * @returns {Array}
 */
export function hasParticipants(aBrowser, participants) {
  aBrowser.element(elements.rosterList).waitForVisible();
  const participantsText = aBrowser.element(elements.rosterList).getText();
  return participants.map((participant) => assert.isTrue(participantsText.includes(participant.displayName)));
}

/**
 * Verifies that a user can open the participant search feature
 *
 * @export
 * @param {Object} aBrowser
 */
export function canSearchForParticipants(aBrowser) {
  openSearch(aBrowser);
  closeSearch(aBrowser);
}

/**
 * Searches for a person and verifies that there are results
 *
 * @export
 * @param {Object} aBrowser
 * @param {String} searchString
 * @param {boolean} doAdd actually add the person to participants
 * @param {String} searchResult the string that should appear in search results
 */
export function searchForPerson(aBrowser, searchString, doAdd = false, searchResult = searchString) {
  openSearch(aBrowser);
  aBrowser.setValue(elements.searchInput, searchString);
  aBrowser.waitForVisible(elements.addParticipantResultsArea);
  aBrowser.waitForVisible(elements.addParticipantResultItem);
  const resultsText = aBrowser.element(elements.addParticipantResultItem).getText();
  assert.isTrue(resultsText.includes(searchResult), 'matching search result is not found in results');
  if (doAdd) {
    aBrowser.click(elements.addParticipantResultItem);
    // Adding a participant immediately takes you back to roster
    aBrowser.waitForVisible(elements.addParticipantArea, 3000, true);
  }
  else {
    closeSearch(aBrowser);
  }
}
