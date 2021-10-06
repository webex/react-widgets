import {assert} from 'chai';

export const elements = {
  rosterWidget: '.webex-roster',
  closeButton: 'button[aria-label="Close"]',
  peopleButton: 'button[aria-label="People"]',
  messagesButton: 'button[aria-label="Messages"]',
  rosterTitle: '.webex-roster .webex-widget-title',
  participantItem: '.webex-participant-list-item',
  rosterList: '.webex-people-list',
  addParticipantArea: '.webex-roster-add-participant',
  addParticipantResultsArea: '.webex-roster-add-participant-results',
  addParticipantResultItem: '.webex-people-list-name',
  addPeopleButton: '.webex-roster-add-people',
  searchInput: '#addParticipantSearchInput',
  closeSearchButton: 'button[aria-label="Close Search"]'
};


function openSearch(aBrowser) {
  assert.isTrue(aBrowser.$(elements.rosterWidget).isDisplayed(), 'roster should be visible for this test');
  assert.isTrue(aBrowser.$(elements.addPeopleButton).isDisplayed(), 'add people button is not visible');
  aBrowser.$(elements.addPeopleButton).click();
  aBrowser.$(elements.addParticipantArea).waitForDisplayed();
  assert.isTrue(aBrowser.$(elements.searchInput).isDisplayed(), 'does not have participant search input');
}

function closeSearch(aBrowser) {
  assert.isTrue(aBrowser.$(elements.closeSearchButton).isDisplayed(), 'does not have a close search button');
  aBrowser.$(elements.closeSearchButton).click();
  assert.isFalse(aBrowser.$(elements.addParticipantArea).isDisplayed(), 'close button is not hiding search');
}


/**
 * Verifies that participants are listed by display name
 * @param {Object} aBrowser
 * @param {Array} participants
 * @returns {Array}
 */
export function hasParticipants(aBrowser, participants) {
  aBrowser.$(elements.rosterList).waitForDisplayed();
  const participantsText = aBrowser.$(elements.rosterList).getText();

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
  aBrowser.$(elements.searchInput).setValue(searchString);
  aBrowser.$(elements.addParticipantResultsArea).waitForDisplayed();
  aBrowser.$(elements.addParticipantResultItem).waitForDisplayed();
  const element = aBrowser.$(elements.addParticipantResultItem);
  const resultsText = element.getText();

  assert.isTrue(resultsText.includes(searchResult), 'matching search result is not found in results');
  if (doAdd) {
    aBrowser.$(elements.addParticipantResultItem).click();
    // Adding a participant immediately takes you back to roster
    aBrowser.$(elements.addParticipantArea).waitForDisplayed({
      timeout: 60000,
      reverse: true
    });
  }
  else {
    closeSearch(aBrowser);
  }
}
