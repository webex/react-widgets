import * as AdaptiveCard from 'adaptivecards';
import MDTextInput from '@webex/react-component-md-text-input';
import MDToggleInput from '@webex/react-component-md-toggle-input';
import MDChoiceSetInput from '@webex/react-component-md-choiceset-input';
import {createMessageObject} from '@webex/redux-module-activity';

import {
  CARD_ATTACHMENT_TYPE,
  TEXT_INPUT_ELEMENT,
  TOGGLE_INPUT_ELEMENT,
  CHOICE_SET_INPUT_ELEMENT,
  ADAPTIVE_CARD_HOST_CONFIG,
  ADAPTIVE_CARD_OPEN_URL_ACTION,
  ADAPTIVE_CARD_SUBMIT_ACTION
} from './constants';

const BaseHostConfig = new AdaptiveCard.HostConfig(ADAPTIVE_CARD_HOST_CONFIG);

/* eslint no-param-reassign: 2 */
/**
 * It used to handle markdown
 * esLint is disabled for param-reassign because based on this documentation https://github.com/microsoft/AdaptiveCards/blob/master/source/nodejs/adaptivecards/README.md#supporting-markdown
 * need to modify the result object only
 * @param {string} text
 * @param {object} result
 * @returns {object}
 */
AdaptiveCard.AdaptiveCard.onProcessMarkdown = function processMarkdown(text, result = {}) {
  try {
    const markedString = createMessageObject(text).content;

    result.outputHtml = markedString !== null ? markedString : text;
    result.didProcess = true;
  }
  catch (err) {
    result.didProcess = false;
  }

  return result;
};

/**
 * It used to call momentum ui compoennts and returns patched adaptive card
 * @param {object} addChildNode
 * @returns {object}
 */
export function getPatchedAdaptiveCard(addChildNode = null) {
  AdaptiveCard.GlobalRegistry.elements.register(TEXT_INPUT_ELEMENT, () => new MDTextInput(addChildNode));
  AdaptiveCard.GlobalRegistry.elements.register(
    TOGGLE_INPUT_ELEMENT, () => new MDToggleInput(addChildNode)
  );
  AdaptiveCard.GlobalRegistry.elements.register(
    CHOICE_SET_INPUT_ELEMENT,
    () => new MDChoiceSetInput(addChildNode)
  );

  return AdaptiveCard;
}

/**
 * It will return the json object by taking the input string
 * @param {string} card
 * @param {object} sdkInstance
 * @returns {object}
 */
export function getCardConfig(card, sdkInstance) {
  try {
    return JSON.parse(card);
  }
  catch (err) {
    sdkInstance.logger.error('Failed to parse Adaptive Card', err);
  }

  return null;
}

/**
 * It will return the rendered adaptive card when message contains card
 * else returns display name
 * @param {array} cards
 * @param {string} displayName
 * @param {object} sdkInstance
 * @param {object} addChildNode
 * @param {string} parentActivity
 * @param {object} convo
 * @param {Function} handleSubmitAction
 * @returns {object}
 */

export function getAdaptiveCard(
  cards,
  displayName,
  sdkInstance,
  addChildNode = null,
  parentActivity,
  convo,
  handleSubmitAction
) {
  // Parse the card for rendering
  try {
    const cardConfig = getCardConfig(cards[0], sdkInstance);
    const PatchedAdaptiveCard = getPatchedAdaptiveCard(addChildNode);
    const adaptiveCard = new PatchedAdaptiveCard.AdaptiveCard();

    adaptiveCard.onExecuteAction = (action) => {
      switch (action.getJsonTypeName()) {
        case ADAPTIVE_CARD_OPEN_URL_ACTION:
          window.open(action.url);
          break;
        case ADAPTIVE_CARD_SUBMIT_ACTION: {
          // get the rendered element in parent object for select action
          const btnClicked = action.renderedElement ? action.renderedElement : action.parent.renderedElement;

          const actionInput = {
            objectType: 'submit',
            inputs: action.data
          };

          handleSubmitAction(convo.get('url'), actionInput, parentActivity, btnClicked);
        }
          break;
        default:
          sdkInstance.logger.error(`Adaptive card ${action.getJsonTypeName()} is not supported yet`);
      }
    };

    adaptiveCard.parse(cardConfig);
    adaptiveCard.hostConfig = BaseHostConfig;

    return adaptiveCard.render();
  }
  catch (err) {
    sdkInstance.logger.error('Failed to parse Adaptive Card', err);
  }

  return displayName;
}

/**
 * It will return the boolean value for adaptive card exists or not
 * @param {array} cards
 * @param {object} sdkInstance
 * @returns {boolean}
 */
export function hasAdaptiveCard(cards, sdkInstance) {
  if (Array.isArray(cards) && cards.length > 0) {
    const cardConfig = getCardConfig(cards[0], sdkInstance);

    return cardConfig !== null && cardConfig.type === CARD_ATTACHMENT_TYPE;
  }

  return false;
}
