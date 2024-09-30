import {constructTeams} from './helpers';

export const FETCH_TEAMS = 'teams/FETCH_TEAMS';
export const STORE_TEAMS = 'teams/STORE_TEAMS';
export const STORE_TEAMS_ERROR = 'teams/STORE_TEAMS_ERROR';

function startFetchTeams() {
  return {
    type: FETCH_TEAMS
  };
}

function storeTeamError(error) {
  return {
    type: STORE_TEAMS_ERROR,
    payload: {
      error
    }
  };
}

function storeTeams(teams) {
  return {
    type: STORE_TEAMS,
    payload: {
      teams: constructTeams(teams)
    }
  };
}

/**
 * Fetches teams from the conversation server
 * @param {object} sparkInstance
 * @returns {Thunk}
 */
export function fetchTeams(sparkInstance) {
  return (dispatch) => {
    dispatch(startFetchTeams());

    return sparkInstance.internal.team.list()
      .then((teams) => {
        if (teams && teams.length) {
          dispatch(storeTeams(teams));

          return Promise.resolve(teams);
        }

        return Promise.resolve();
      })
      .catch((e) => {
        dispatch(storeTeamError(e));

        return Promise.reject(new Error('Could not fetch teams', e));
      });
  };
}
