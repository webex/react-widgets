const urlTypes = ['url', 'backgroundImage', 'iconUrl'];

/**
 * replaces the index with the uri in cards
 * @param {Object} cardsActivity
 * @param {Array} decryptedURLs
 * @returns {Object}
 */
export function replaceIndexWithBlobURL(cardsActivity, decryptedURLs) {
  const activityObject = JSON.parse(JSON.stringify(cardsActivity));

  if (activityObject) {
    // eslint-disable-next-line no-restricted-syntax
    for (const property in activityObject) {
      if (Object.prototype.hasOwnProperty.call(activityObject, property)) {
        const index = urlTypes.indexOf(property);
        const key = urlTypes[index];

        if (urlTypes.includes(property) && property === key && !Number.isNaN(Number(activityObject[key]))) {
          activityObject[key] = decryptedURLs[Number(activityObject[key])];
        }
        else if (typeof activityObject[property] === 'object') {
          activityObject[property] = replaceIndexWithBlobURL(activityObject[property], decryptedURLs);
        }
      }
    }
  }

  return activityObject;
}

export default replaceIndexWithBlobURL;
