import {assert} from 'chai';

export const FEATURE_FLAG_ROSTER = `js-widgets-roster`;

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
 * @param {Object} aBrowser
 * @param {Array} participants
 * @returns {Array}
 */
export function hasParticipants(aBrowser, participants) {
  aBrowser.element(elements.rosterList).waitForVisible();
  const participantsText = aBrowser.element(elements.rosterList).getText();
  return participants.map((participant) => assert.isTrue(participantsText.includes(participant.displayName)));
}
