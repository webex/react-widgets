import {constructHydraId, hydraTypes} from '@webex/react-component-utils';

export const eventNames = {
  CALLS_CREATED: 'calls:created',
  CALLS_CONNECTED: 'calls:connected',
  CALLS_DISCONNECTED: 'calls:disconnected',
  MEMBERSHIPS_NOTIFIED: 'memberships:notified',
  MEMBERSHIPS_CONNECTED: 'memberships:connected',
  MEMBERSHIPS_DECLINED: 'memberships:declined',
  MEMBERSHIPS_DISCONNECTED: 'memberships:disconnected'
};

/**
 * Creates an event data object for DOM and event hooks
 *
 * @export
 * @param {Object} call
 * @param {Object} actor
 * @param {String} spaceId
 * @returns {Object}
 */
export function constructCallEventData({callInstance, actor}) {
  let personDetails = {};

  if (actor) {
    personDetails = {
      actorId: constructHydraId(hydraTypes.PEOPLE, actor.id),
      actorName: actor.name,
      personId: constructHydraId(hydraTypes.PEOPLE, actor.id),
      personEmail: actor.email
    };
  }

  if (callInstance?.locusInfo) {
    const {
      locusInfo: {
        host,
        conversationUrl
      }
    } = callInstance;

    if (host) {
      personDetails.actorId = constructHydraId(hydraTypes.PEOPLE, host.id);
      personDetails.actorName = host.name;
      personDetails.personEmail = host.email;
      personDetails.personId = constructHydraId(hydraTypes.PEOPLE, host.id);
    }
    if (conversationUrl) {
      const conversationId = conversationUrl.split('/').pop();

      personDetails.roomId = constructHydraId(hydraTypes.ROOM, conversationId);
    }
  }

  return {
    ...personDetails,
    call: callInstance
  };
}
