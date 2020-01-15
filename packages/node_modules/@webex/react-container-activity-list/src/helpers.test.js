import {isActivityVisible} from './helpers';

describe('isActivityVisible function', () => {
  const tombstoneActivity = {
    object: {
      objectType: {}
    },
    verb: 'tombstone'
  };
  const postActivity = {
    object: {
      displayName: 'hi',
      objectType: 'comment'
    },
    verb: 'post'
  };
  const shareActivity = {
    object: {
      objectType: 'content'
    },
    verb: 'share'
  };
  const createActivity = {
    object: {
      objectType: 'conversation'
    },
    verb: 'create'
  };
  const updateActivity = {
    object: {
      objectType: 'locusSessionSummaryParticipant'
    },
    verb: 'update'
  };
  const updateActivity2 = {
    object: {
      objectType: 'locusSessionSummary'
    },
    verb: 'update'
  };
  const addActivity = {
    object: {
      objectType: 'person'
    },
    verb: 'add'
  };
  const leaveActivity = {
    object: {
      objectType: 'person'
    },
    verb: 'leave'
  };
  const lyraSpaceActivity = {
    object: {
      objectType: 'person',
      type: 'LYRA_SPACE'
    }
  };


  it('returns true if tombstone activity', () => {
    expect(isActivityVisible(tombstoneActivity)).toBeTruthy();
  });

  it('returns true if post activity', () => {
    expect(isActivityVisible(postActivity)).toBeTruthy();
  });

  it('returns true if share activity', () => {
    expect(isActivityVisible(shareActivity)).toBeTruthy();
  });

  it('returns true if create activity', () => {
    expect(isActivityVisible(createActivity)).toBeTruthy();
  });

  it('returns true if update activities', () => {
    expect(isActivityVisible(updateActivity)).toBeTruthy();
    expect(isActivityVisible(updateActivity2)).toBeTruthy();
  });

  it('returns true if add activity', () => {
    expect(isActivityVisible(addActivity)).toBeTruthy();
  });

  it('returns true if leave activity', () => {
    expect(isActivityVisible(leaveActivity)).toBeTruthy();
  });

  it('returns false if activity type is lyra space', () => {
    expect(isActivityVisible(lyraSpaceActivity)).toBeFalsy();
  });
});
