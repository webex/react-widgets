import {FEATURES_WIDGET_ADAPTIVE_CARD, FEATURES_WIDGET_ADAPTIVE_CARD_OFF, FEATURES_WIDGET_ADAPTIVE_CARD_ON} from './constants';
// eslint-disable-next-line import/prefer-default-export
export function getAdaptiveCardFeatureState(features) {
  let adaptiveCardFeatureState = FEATURES_WIDGET_ADAPTIVE_CARD_OFF;

  if (features !== undefined && features !== null) {
    const items = features.get('items');

    if (features && items && items.size > 0) {
      const adaptiveCardFeatures = items.get(FEATURES_WIDGET_ADAPTIVE_CARD);

      if (adaptiveCardFeatures) {
        adaptiveCardFeatureState = FEATURES_WIDGET_ADAPTIVE_CARD_ON;
      }
    }
  }

  return adaptiveCardFeatureState;
}
