import {getAdaptiveCardFeatureState} from './adaptiveCard';
import {FEATURES_WIDGET_ADAPTIVE_CARD, FEATURES_WIDGET_ADAPTIVE_CARD_OFF, FEATURES_WIDGET_ADAPTIVE_CARD_ON, FEATURES_DEVELOPER} from './constants';

describe('Get Adaptive Card Feature State', () => {
  let features;
  let items;

  beforeEach(() => {
    features = new Map();
    items = new Map();
  });

  it('returns WIDGET_ADAPTIVE_CARD_OFF if features are not set', () => {
    expect(getAdaptiveCardFeatureState(features)).toEqual(FEATURES_WIDGET_ADAPTIVE_CARD_OFF);
  });

  it(`returns WIDGET_ADAPTIVE_CARD_ON if ${FEATURES_DEVELOPER} feature "${FEATURES_WIDGET_ADAPTIVE_CARD}" is set `, () => {
    features.set('items', items.set(FEATURES_WIDGET_ADAPTIVE_CARD, true));
    expect(getAdaptiveCardFeatureState(features)).toEqual(FEATURES_WIDGET_ADAPTIVE_CARD_ON);
  });
});
