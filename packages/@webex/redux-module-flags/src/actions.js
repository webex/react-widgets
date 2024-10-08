export const ADD_FLAG = 'flags/ADD_FLAG';
export const STORE_FLAGS = 'flags/STORE_FLAGS';
export const REMOVE_FLAG = 'flags/REMOVE_FLAG';
export const UPDATE_FLAG_STATUS = 'flags/UPDATE_FLAG_STATUS';

function updateFlagStatus(status) {
  return {
    type: UPDATE_FLAG_STATUS,
    payload: {
      status
    }
  };
}


function addFlag(flag, error) {
  return {
    type: ADD_FLAG,
    payload: {
      flag,
      error
    }
  };
}


function storeFlags(flags, error) {
  return {
    type: STORE_FLAGS,
    payload: {
      flags,
      error
    }
  };
}


function removeFlag(flag, error) {
  return {
    type: REMOVE_FLAG,
    payload: {
      error,
      flag
    }
  };
}


function constructFlag(flag) {
  return {
    id: flag.id,
    url: flag.url,
    activityUrl: flag['flag-item'],
    isInFlight: false
  };
}


/**
 * Fetches all of the current user's flags
 *
 * @param {any} sparkInstance
 * @returns {function}
 */
export function fetchFlags(sparkInstance) {
  return (dispatch) => {
    dispatch(updateFlagStatus({isFetching: true}));

    return sparkInstance.internal.flag.list()
      .then((flags) => {
        let flagsMap = flags.map(constructFlag);

        flagsMap = flagsMap.reduce((acc, val) => {
          acc[val.activityUrl] = val;

          return acc;
        }, {});

        return dispatch(storeFlags(flagsMap));
      })
      .catch((error) => sparkInstance.logger.warn(error));
  };
}

/**
 * Flags a given activity. Updates state immediately then
 * adds flag details given from api
 *
 * @param {any} activity
 * @param {any} spark
 * @returns {function}
 */
export function flagActivity(activity, spark) {
  return (dispatch) => {
    const flagObject = {
      activityUrl: activity.url,
      isInFlight: true
    };

    dispatch(addFlag(flagObject));

    return spark.internal.flag.create(activity)
      .then((flag) =>
        dispatch(addFlag(constructFlag(flag))))
      .catch((error) => spark.logger.warn(error));
  };
}

/**
 * Removes a flag from the server. Updates the state immediately
 * but re-adds it if the delete fails
 *
 * @param {any} flag
 * @param {any} spark
 * @returns {function}
 */
export function removeFlagFromServer(flag, spark) {
  return (dispatch) => {
    dispatch(removeFlag(flag));

    return spark.internal.flag.delete(flag.toJS())
      .catch((error) => {
        spark.logger.warn(error);
      });
  };
}
