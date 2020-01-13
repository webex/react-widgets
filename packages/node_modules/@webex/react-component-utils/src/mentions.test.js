import {hasMentions} from '@webex/react-component-utils';

describe('Get has mentions', () => {
  let space;
  const user = {
    id: '123'
  };

  beforeEach(() => {
    space = {
      latestActivity: {
        object: {}
      }
    };
  });
  afterEach(() => {
    space = {};
  });
  it('return true for @single person mention', () => {
    space = {...space, latestActivity: {object: {mentions: {items: [{id: '123'}]}}}};
    expect(hasMentions(user, space)).toBeTruthy();
  });
  it('return true for @All mention', () => {
    space = {...space, latestActivity: {object: {mentions: {items: []}}}};
    expect(hasMentions(user, space)).toBeTruthy();
  });
  it('return false for no mentions', () => {
    space = {...space, latestActivity: {}};
    expect(hasMentions(user, space)).toBeFalsy();
  });
});
