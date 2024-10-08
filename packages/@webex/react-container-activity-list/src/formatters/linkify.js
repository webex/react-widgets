import linkifyHtml from 'linkifyjs/html';
import linkifyStr from 'linkifyjs/string';

export default (activity) => {
  const linkifyOptions = {
    ignoreTags: ['code', 'pre'],
    className: 'webex-activity-link'
  };

  if (activity.content) {
    return Object.assign({}, activity, {content: linkifyHtml(activity.content, linkifyOptions)});
  }

  return Object.assign({}, activity, {content: linkifyStr(activity.displayName, linkifyOptions)});
};
