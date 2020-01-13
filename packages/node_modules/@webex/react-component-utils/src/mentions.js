/*
 * Check for mentions
 * @param  {Object} currentUser - current user
 * @param  {Object} space - a space
 * @returns {boolean} a value that indicates whether this space has mentions of targeted user/all or not
 */
export function hasMentions(currentUser, space) {
  const {latestActivity} = space;

  if (latestActivity) {
    const mentions = latestActivity.object && space.latestActivity.object.mentions;
    const {id} = currentUser;

    // @User mentions
    const userMentions = mentions && mentions.items && mentions.items.find((item) => item.id === id);

    // @All mentions
    const allMentions = mentions && mentions.items && mentions.items.length === 0;

    if (userMentions || allMentions) {
      return true;
    }
  }

  return false;
}

export default hasMentions;
