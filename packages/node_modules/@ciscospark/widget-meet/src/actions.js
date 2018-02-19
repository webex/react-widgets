export const UPDATE_LOCAL_VIDEO_POSITION = 'widget-meet/UPDATE_LOCAL_VIDEO_POSITION';
export const UPDATE_WIDGET_STATUS = 'widget-meet/UPDATE_WIDGET_STATUS';
export const STORE_MEET_DETAILS = 'widget-meet/STORE_MEET_DETAILS';

export function updateLocalVideoPosition(position) {
  return {
    type: UPDATE_LOCAL_VIDEO_POSITION,
    payload: {
      position
    }
  };
}

export function updateWidgetStatus(status) {
  return {
    type: UPDATE_WIDGET_STATUS,
    payload: {
      status
    }
  };
}

export function storeMeetDetails(details) {
  return {
    type: STORE_MEET_DETAILS,
    payload: details
  };
}
