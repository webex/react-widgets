import uuid from 'uuid';
import {buildHydraRoomId, hydraTypes} from '@webex/common';

import {validateAndDecodeId} from './uuid-utils';

describe('uuid-utils', () => {
  describe('validateAndDecodeId', () => {
    it('returns an id object for a uuid input', () => {
      const ID = uuid.v4();

      expect(validateAndDecodeId(ID)).toEqual({id: ID});
    });

    it('deconstructs a hydra ID', () => {
      const id = uuid.v4();
      const cluster = 'us';
      const hydraId = buildHydraRoomId(id, cluster);

      expect(validateAndDecodeId(hydraId)).toEqual({id, cluster, type: hydraTypes.ROOM});
    });

    it('returns an empty object on invalid input: [null]', () => {
      expect(validateAndDecodeId(null)).toEqual({});
    });

    it('returns an empty object on invalid input: [empty string]', () => {
      expect(validateAndDecodeId('')).toEqual({});
    });

    it('returns an empty object on invalid input [AB%CD]', () => {
      expect(validateAndDecodeId('AB%CD')).toEqual({});
    });

    it('returns an empty object on invalid hydra ID', () => {
      const id = 'INVALID';
      const cluster = 'us';
      const hydraId = buildHydraRoomId(id, cluster);

      expect(validateAndDecodeId(hydraId)).toEqual({});
    });
  });
});
