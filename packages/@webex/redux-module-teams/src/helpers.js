export function constructTeam(team) {
  return {
    id: team.id,
    color: team.teamColor,
    generalConversationId: team.generalConversationUuid,
    displayName: team.displayName,
    description: team.summary,
    status: {
      isArchived: team.archived
    }
  };
}

export function constructTeams(teams) {
  return teams.map(constructTeam);
}
