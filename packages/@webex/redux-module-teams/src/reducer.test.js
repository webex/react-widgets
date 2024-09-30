import reducer, {initialState} from './reducer';
import {
  FETCH_TEAMS,
  STORE_TEAMS,
  STORE_TEAMS_ERROR
} from './actions';

describe('redux-module-teams reducer', () => {
  let teams;

  beforeEach(() => {
    teams = [
      {
        id: 'teamId',
        color: '#abcabc',
        generalConversationId: '10000000-0000-0000-0000-000000000000',
        displayName: 'test team!',
        description: 'team that tests',
        status: {
          isArchived: false
        }
      }
    ];
  });

  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle FETCH_TEAMS', () => {
    expect(reducer(initialState, {
      type: FETCH_TEAMS
    })).toMatchSnapshot();
  });

  it('should handle STORE_TEAMS', () => {
    expect(reducer(initialState, {
      type: STORE_TEAMS,
      payload: {
        teams
      }
    })).toMatchSnapshot();
  });

  it('should handle STORE_TEAMS_ERROR', () => {
    expect(reducer(initialState, {
      type: STORE_TEAMS_ERROR,
      payload: {
        error: new Error('429 Retry')
      }
    })).toMatchSnapshot();
  });
});
