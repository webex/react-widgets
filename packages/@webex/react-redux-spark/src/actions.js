import {getStatusFromInstance} from './helpers';

export const REGISTER_DEVICE_FAILURE = 'spark/REGISTER_DEVICE_FAILURE';
export const UNREGISTER_DEVICE_FAILURE = 'spark/UNREGISTER_DEVICE_FAILURE';
export const STORE_SPARK_INSTANCE = 'spark/STORE_SPARK_INSTANCE';
export const UPDATE_SPARK_STATUS = 'spark/UPDATE_SPARK_STATUS';
export const STORE_SPARK_ADAPTOR = 'spark/STORE_SPARK_ADAPTOR';

function registerDeviceFailure(error) {
  return {
    type: REGISTER_DEVICE_FAILURE,
    payload: {
      error
    }
  };
}

function unregisterDeviceFailure(error) {
  return {
    type: UNREGISTER_DEVICE_FAILURE,
    payload: {
      error
    }
  };
}

export function updateSparkStatus(status) {
  return {
    type: UPDATE_SPARK_STATUS,
    payload: {
      status
    }
  };
}


export function storeSparkInstance(spark) {
  return {
    type: STORE_SPARK_INSTANCE,
    payload: {
      status: getStatusFromInstance(spark),
      spark
    }
  };
}

export const storeSparkAdaptor = (adaptor) => ({
  type: STORE_SPARK_ADAPTOR,
  payload: {
    adaptor
  }
});

export function registerDevice(spark) {
  return (dispatch) => {
    dispatch(updateSparkStatus({registering: true}));

    return spark.internal.device.register()
      .then(() => dispatch(updateSparkStatus({registering: false, registered: true})))
      .catch((error) => dispatch(registerDeviceFailure(error)));
  };
}


export function unregisterDevice(spark) {
  return (dispatch) => {
    dispatch(updateSparkStatus({unregistering: true}));

    return spark.internal.device.unregister()
      .then(() => dispatch(updateSparkStatus({unregistering: false, registered: false})))
      .catch((error) => dispatch(unregisterDeviceFailure(error)));
  };
}
