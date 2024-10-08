import {createSDKInstance} from './sdk';

describe('SDK', () => {
  describe('createSDKInstance', () => {
    it('should resolve instance with config defaults', async () => {
      const instance = await createSDKInstance('abc123');

      expect(instance.config.appName).toBe('webex-widgets');
    });
    it('should resolve instance with appName passed in', async () => {
      const instance = await createSDKInstance('abc123', {name: 'test-app'});

      expect(instance.config.appName).toStrictEqual('webex-widgets-test-app');
    });
  });
});
