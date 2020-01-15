export const STORE_METRIC = 'metrics/STORE_METRIC';
export const DELETE_METRIC = 'metrics/DELETE_METRIC';
export const ADD_TO_QUEUE = 'metrics/ADD_TO_QUEUE';
export const CLEAR_QUEUE = 'metrics/CLEAR_QUEUE';
export const STORE_START = 'metrics/STORE_START';
export const STORE_END = 'metrics/STORE_END';
export const UPDATE_METRICS_STATUS = 'metrics/UPDATE_METRICS_STATUS';

export function storeMetric(name, data) {
  return {
    type: STORE_METRIC,
    payload: {
      name,
      data
    }
  };
}

export function deleteMetric(name) {
  return {
    type: DELETE_METRIC,
    payload: {
      name
    }
  };
}

export function addToQueue(data) {
  return {
    type: ADD_TO_QUEUE,
    payload: {
      data
    }
  };
}

export function clearQueue() {
  return {
    type: CLEAR_QUEUE
  };
}

export function updateMetricsStatus(status) {
  return {
    type: UPDATE_METRICS_STATUS,
    payload: {
      status
    }
  };
}
