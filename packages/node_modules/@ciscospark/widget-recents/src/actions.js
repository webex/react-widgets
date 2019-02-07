export const UPDATE_SPACE_KEYWORD_FILTER = 'widget-recents/UPDATE_SPACE_KEYWORD_FILTER';
export const UPDATE_STATUS = 'widget-recents/UPDATE_STATUS';

export function updateSpaceKeywordFilter(keyword) {
  return {
    type: UPDATE_SPACE_KEYWORD_FILTER,
    payload: {
      keyword
    }
  };
}

export function updateWidgetStatus(status) {
  return {
    type: UPDATE_STATUS,
    payload: {
      status
    }
  };
}
