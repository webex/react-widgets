import {Map} from 'immutable';

export const STORE_FEATURE = 'features/STORE_FEATURE';

export const initialState = new Map({
  items: new Map()
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case STORE_FEATURE:
      return state.mergeIn(['items'], action.payload.feature);
    default:
      return state;
  }
}

function storeFeature(feature) {
  return {
    type: STORE_FEATURE,
    payload: {
      feature
    }
  };
}

/**
 * Gets the value of the requested feature toggle.
 * @param {string} keyType <developer|user|entitlement>
 * @param {string} key
 * @param {object} spark
 * @returns {Promise}
 */
export function getFeature(keyType, key, spark) {
  return (dispatch) => spark.internal.feature.getFeature(keyType, key)
    .then((value) => {
      const result = {};

      result[key] = value;
      dispatch(storeFeature(result));
    });
}