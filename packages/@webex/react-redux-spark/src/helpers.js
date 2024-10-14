/* eslint-disable import/prefer-default-export */

/**
 * Gets the status booleans from different parts of the SDK instance
 *
 * @export
 * @param {Object} sdkInstance
 * @returns {Object} status
 * @returns {boolean} status.authenticated
 * @returns {boolean} status.authenticating
 * @returns {boolean} status.registered
 */
export function getStatusFromInstance(sdkInstance) {
  return {
    authenticated: sdkInstance.canAuthorize,
    authenticating: sdkInstance.isAuthenticating,
    registered: sdkInstance.internal.device.registered
  };
}
