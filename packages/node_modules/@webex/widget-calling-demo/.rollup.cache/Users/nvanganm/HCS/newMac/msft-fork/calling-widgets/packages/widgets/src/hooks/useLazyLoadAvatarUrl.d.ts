/**
 * Handles the lazy loading of an avatar source url
 *
 * @param {string} userId user's id
 * @param {() => Promise<string | undefined>} fetchAvatarUrlFn function to call to fetch the avatar url
 * @returns {[string | undefined]} array containing url of the avatar image
 */
export declare const useLazyLoadAvatarUrl: (userId: string, fetchAvatarUrlFn?: (() => Promise<string | undefined>) | undefined) => (string | undefined)[];
//# sourceMappingURL=useLazyLoadAvatarUrl.d.ts.map