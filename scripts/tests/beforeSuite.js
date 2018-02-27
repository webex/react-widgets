/**
 * Hook that gets executed before the suite starts
 * @param {Object} suite suite details
 */
module.exports = () => {
  process.env.CISCOSPARK_SCOPE = [
    'webexsquare:get_conversation',
    'spark:people_read',
    'spark:rooms_read',
    'spark:rooms_write',
    'spark:memberships_read',
    'spark:memberships_write',
    'spark:messages_read',
    'spark:messages_write',
    'spark:teams_read',
    'spark:teams_write',
    'spark:team_memberships_read',
    'spark:team_memberships_write',
    'spark:kms'
  ].join(' ');
};
