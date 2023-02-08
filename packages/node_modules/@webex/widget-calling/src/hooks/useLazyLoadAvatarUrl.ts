import { useCallback, useEffect, useState } from 'react';

/**
 * Handles the lazy loading of an avatar source url
 *
 * @param {string} userId user's id
 * @param {() => Promise<string | undefined>} fetchAvatarUrlFn function to call to fetch the avatar url
 * @returns {[string | undefined]} array containing url of the avatar image
 */
export const useLazyLoadAvatarUrl = (
  userId: string,
  fetchAvatarUrlFn?: () => Promise<string | undefined>
) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const fetchUserAvatar = useCallback(async () => {
    if (!fetchAvatarUrlFn) return;
    const url = await fetchAvatarUrlFn();
    setImageUrl(url);
  }, [fetchAvatarUrlFn]);
  useEffect(() => {
    fetchUserAvatar();
  }, [userId, fetchUserAvatar]);

  return [imageUrl];
};
