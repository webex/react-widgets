import {
  MENTION_NOTIFICATIONS_ON,
  MENTION_NOTIFICATIONS_OFF,
  MESSAGE_NOTIFICATIONS_ON,
  MESSAGE_NOTIFICATIONS_OFF,
  SPACE_TYPE_ONE_ON_ONE,
  SPACE_TYPE_GROUP,
  deconstructHydraId
} from '@webex/react-component-utils';

const TAG_ONE_ON_ONE = 'ONE_ON_ONE';
const TAG_HIDDEN = 'HIDDEN';

export const TAG_LOCKED = 'LOCKED';

export function constructLastestActivity(items) {
  const latest = items.find((item) => ['tombstone', 'delete'].indexOf(item.verb) === -1);

  return latest;
}

/**
 * Creates team object to be stored
 *
 * @param {Object} space
 * @param {Bool} isDecrypting
 * @returns {Object} formatted space object
 */
export function constructSpace(space) {
  const latestActivity = constructLastestActivity(space.activities.items);
  const s = {
    avatar: space.avatar,
    displayName: space.displayName || space.computedTitle,
    id: space.id,
    url: space.url,
    globalId: space.globalId,
    locusUrl: space.locusUrl,
    activities: space.activities.items.map((a) => a.id),
    lastReadableActivityDate: space.lastReadableActivityDate,
    lastSeenActivityDate: space.lastSeenActivityDate,
    conversationWebUrl: space.conversationWebUrl,
    participants: space.participants.items,
    type: space.tags.includes(TAG_ONE_ON_ONE) ? SPACE_TYPE_ONE_ON_ONE : SPACE_TYPE_GROUP,
    published: space.published,
    tags: space.tags,
    isDecrypting: space.isDecrypting,
    isHidden: space.tags.includes(TAG_HIDDEN),
    isLocked: space.tags.includes(TAG_LOCKED),
    isMentionNotificationsOn: space.tags && space.tags.includes(MENTION_NOTIFICATIONS_ON) ? true : undefined,
    isMentionNotificationsOff: space.tags && space.tags.includes(MENTION_NOTIFICATIONS_OFF) ? true : undefined,
    isMessageNotificationsOn: space.tags && space.tags.includes(MESSAGE_NOTIFICATIONS_ON) ? true : undefined,
    isMessageNotificationsOff: space.tags && space.tags.includes(MESSAGE_NOTIFICATIONS_OFF) ? true : undefined
  };

  // Left spaces will still show up sometimes with empty activities
  if (!space.lastReadableActivityDate && space.published) {
    s.lastReadableActivityDate = space.published;
  }

  if (latestActivity) {
    s.latestActivity = latestActivity.id;
  }

  if (space.team) {
    s.team = space.team.id;
  }

  return s;
}

export function constructSpaces(spaces) {
  return spaces.map((space) => constructSpace(space));
}


/**
 * Converts a hydra room object to a conversation space object
 * (as much as possible)
 *
 * @param {object} room
 * @param {string} room.id ex: "Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0"
 * @param {string} room.title ex: "Project Unicorn - Sprint 0"
 * @param {string} room.type ex: "group"
 * @param {string} room.isLocked ex: true
 * @param {string} room.teamId ex: "Y2lzY29zcGFyazovL3VzL1JPT00vNjRlNDVhZTAtYzQ2Yi0xMWU1LTlkZjktMGQ0MWUzNDIxOTcz"
 * @param {string} room.lastActivity ex: "2016-04-21T19:12:48.920Z"
 * @param {string} room.creatorId ex: "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNWIzNjE4Ny1jOGRkLTQ3MjctOGIyZi1mOWM0NDdmMjkwNDY"
 * @param {string} room.created ex: "2016-04-21T19:01:55.966Z
 *
 * @returns {object} converted space object
 */
export function constructSpaceFromHydraRoom(room) {
  const {id: globalId} = room;
  const {id, cluster} = deconstructHydraId(globalId);
  const team = room.teamId ? {id: deconstructHydraId(room.teamId).id} : '';
  const type = room.type === 'direct' ? SPACE_TYPE_ONE_ON_ONE : SPACE_TYPE_GROUP;
  const tags = room.isLocked ? [TAG_LOCKED] : [];

  return {
    id,
    cluster,
    globalId,
    type,
    team,
    tags,
    displayName: room.title,
    lastReadableActivityDate: room.lastActivity,
    isDecrypting: false,
    activities: {
      items: []
    },
    participants: {
      items: []
    }
  };
}
