export function constructActivity(activity) {
  return {
    id: activity.id,
    actor: activity.actor ? activity.actor.id : undefined,
    type: activity.verb,
    objectType: activity.objectType,
    published: activity.published,
    object: activity.object,
    url: activity.url
  };
}

export function constructActivities(activities) {
  return activities.map(constructActivity);
}
