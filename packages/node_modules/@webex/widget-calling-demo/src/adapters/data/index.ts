export * from './callHistory';

export const mockDataSource = {
  callHistory: {
    'user1-callHistory': ['item1', 'item2', 'item3'],
    item1: { id: 'item1', name: 'test' },
    item2: { id: 'item2', name: 'test2' },
  },
  speedDial: {
    'user1-speedDial': ['dial1', 'dial2', 'dial3'],
    dial1: {},
    dial2: {},
  },
  users: {
    user1: {
      ID: 'user1',
      emails: ['barbara.german@acme.com'],
      displayName: 'Barbara German',
      firstName: 'Barbara',
      lastName: 'German',
      nickName: '',
      avatar: '<URL to avatar>',
      orgID: '',
      status: null,
    },
    user2: {
      ID: 'user2',
      emails: ['giacomo.drago@acme.com'],
      displayName: 'Giacomo Drago',
      firstName: 'Giacomo',
      lastName: 'Drago',
      nickName: '',
      avatar: '<URL to avatar>',
      orgID: '',
      status: 'active',
    },
  },
};
