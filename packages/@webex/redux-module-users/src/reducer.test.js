import reducer, {initialState} from './reducer';
import {
  STORE_USER,
  STORE_USERS,
  FETCH_USER_REQUEST,
  STORE_CURRENT_USER,
  FETCH_CURRENT_USER_REQUEST
} from './actions';

let user1, user2;

describe('redux-module-users reducer', () => {
  beforeEach(() => {
    user1 = {
      id: '10000000-0000-0000-0000-000000000000',
      displayName: 'Spark User 1',
      nickName: 'Spark 1',
      email: 'email1@cisco.com',
      orgId: '00000000-org1-org2-org3-000000000000',
      status: {
        isFetching: false
      }
    };
    user2 = {
      id: '20000000-0000-0000-0000-000000000000',
      displayName: 'Spark User 2',
      nickName: 'Spark 2',
      email: 'email2@cisco.com',
      orgId: '00000000-org1-org2-org3-000000000000',
      status: {
        isFetching: false
      }
    };
  });

  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle STORE_USER', () => {
    expect(reducer(initialState, {
      type: STORE_USER,
      payload: {
        user: user1
      }
    })).toMatchSnapshot();
  });

  it('should handle STORE_USERS', () => {
    expect(reducer(initialState, {
      type: STORE_USERS,
      payload: {
        users: [user1, user2]
      }
    })).toMatchSnapshot();
  });

  it('should handle STORE_CURRENT_USER', () => {
    expect(reducer(initialState, {
      type: STORE_CURRENT_USER,
      payload: {
        user: user1
      }
    })).toMatchSnapshot();
  });

  it('should handle FETCH_USER_REQUEST with id', () => {
    expect(reducer(initialState, {
      type: FETCH_USER_REQUEST,
      payload: {
        id: user1.id
      }
    })).toMatchSnapshot();
  });

  it('should handle FETCH_USER_REQUEST with email', () => {
    expect(reducer(initialState, {
      type: FETCH_USER_REQUEST,
      payload: {
        email: user1.email
      }
    })).toMatchSnapshot();
  });

  it('should handle FETCH_CURRENT_USER_REQUEST with id', () => {
    expect(reducer(initialState, {
      type: FETCH_CURRENT_USER_REQUEST,
      payload: {
        email: user1.id
      }
    })).toMatchSnapshot();
  });
});
