import {constructUserFromHydra, constructUserFromParticipant, constructUser} from './helpers';

describe('Redux module users helpers', () => {
  describe('#constructUserFromParticipant', () => {
    it('converts a participant object to user shape', () => {
      const user = {
        id: '1234',
        displayName: 'Johnny Karate',
        emailAddress: 'thepit@mouserat.net',
        orgId: 'pwn33'
      };

      expect(constructUserFromParticipant(user)).toMatchSnapshot();
    });

    it('supports an empty displayName', () => {
      const user = {
        id: '1234',
        emailAddress: 'thepit@mouserat.net',
        orgId: 'pwn33'
      };

      expect(constructUserFromParticipant(user)).toMatchSnapshot();
    });
  });

  describe('#constructUserFromHydra', () => {
    it('converts a hydra object to user shape', () => {
      const user = {
        id: 'Y2lzY29zcGFyazovL3VzL1BFUlNPTi93aGF0ZXZlcmJybw==',
        displayName: 'Johnny Karate',
        nickName: 'Burt Macklin',
        emails: ['thepit@mouserat.net'],
        orgId: 'Y2lzY29zcGFyazovL3VzL09SRy9teS1vcmc='
      };

      expect(constructUserFromHydra(user)).toMatchSnapshot();
    });

    it('converts a hydra object to user shape without a nickname', () => {
      const user = {
        id: 'Y2lzY29zcGFyazovL3VzL1BFUlNPTi93aGF0ZXZlcmJybw==',
        displayName: 'Johnny Karate',
        emails: ['thepit@mouserat.net'],
        orgId: 'Y2lzY29zcGFyazovL3VzL09SRy9teS1vcmc='
      };

      expect(constructUserFromHydra(user)).toMatchSnapshot();
    });

    it('supports an empty user', () => {
      expect(constructUserFromHydra()).toMatchSnapshot();
    });
  });

  describe('#constructUser', () => {
    it('detects and converts a hydra user', () => {
      const user = {
        id: 'Y2lzY29zcGFyazovL3VzL1BFUlNPTi93aGF0ZXZlcmJybw==',
        displayName: 'Johnny Karate',
        nickName: 'Burt Macklin',
        emails: ['thepit@mouserat.net'],
        orgId: 'Y2lzY29zcGFyazovL3VzL09SRy9teS1vcmc='
      };

      expect(constructUser(user)).toMatchSnapshot();
    });

    it('detects and converts a participant user', () => {
      const user = {
        id: '1234',
        displayName: 'Johnny Karate',
        emailAddress: 'thepit@mouserat.net',
        orgId: 'pwn33'
      };

      expect(constructUser(user)).toMatchSnapshot();
    });
  });
});
