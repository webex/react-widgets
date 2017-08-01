import {assert} from 'chai';

export const elements = {
  rosterWidget: `.ciscospark-roster`,
  closeButton: `button[aria-label="Close"]`,
  peopleButton: `button[aria-label="People"]`,
  rosterTitle: `.ciscospark-roster-title`,
  participantItem: `.ciscospark-participant-list-item`,
  rosterList: `.ciscospark-roster-scrolling-list`
};

/**
 * Verifies that participants are listed by display name
 * @param {Object} browser
 * @param {Array} participants
 * @returns {Array}
 */
export function hasParticipants(browser, participants) {
  const participantsText = browser.element(elements.rosterList).getText();
  return participants.map((participant) => assert.isTrue(participantsText.includes(participant.displayName)));
}
