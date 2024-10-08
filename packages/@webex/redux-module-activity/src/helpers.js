import marked from 'marked';
import {escapeSync, filterSync} from '@webex/helper-html';

import {resetActivity} from './actions';

/**
 * Create objectURL
 *
 * @param {object} file
 * @returns {string}
 */
export function createObjectURL(file) {
  const urlCreator = window.URL || window.webkitURL;

  return urlCreator.createObjectURL(file);
}

/**
 * Revoke objectURL
 *
 * @param {object} file
 * @returns {undefined}
 */
export function revokeObjectURL(file) {
  const urlCreator = window.URL || window.webkitURL;

  urlCreator.revokeObjectURL(file);
}


/**
 * Parses react-mention data from input text
 *
 * @param {string} text
 * @param {string} plainText
 * @returns {Object}
 * @returns {Object.mentions}
 * @returns {Object.mentionsText}
 */

export function getMentions(text, plainText) {
  const regex = /@\{(.+?)\}\|([a-zA-Z0-9-]+)\|/g;
  const mentions = [];
  const mentionsText = text.replace(regex, (match, display, id) => {
    mentions.push({
      id,
      objectType: 'person'
    });

    return `<spark-mention data-object-type="person" data-object-id="${id}">${display}</spark-mention>`;
  });
  const mentionsPlainText = plainText.replace(regex, (match, display) => display);

  return {
    mentions,
    mentionsPlainText,
    mentionsText
  };
}

function filterMarked(content) {
  return filterSync(() => {}, {
    'spark-mention': ['data-object-type', 'data-object-id', 'data-object-url'],
    a: ['href'],
    b: [],
    blockquote: ['class'],
    strong: [],
    i: [],
    em: [],
    pre: [],
    code: ['class'],
    br: [],
    hr: [],
    p: [],
    ul: [],
    ol: [],
    li: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: []
  }, [], content);
}

/**
 * Creates markdown and stripped text object
 *
 * @param {string} text
 * @returns {object}
 * @returns {object.content} Converted markdown content
 * @returns {object.displayName} Raw text content
 */
export function createMessageObject(text) {
  const messageObject = {
    displayName: '',
    objectType: 'comment'
  };

  if (typeof text === 'string') {
    const origContent = text.trim();
    let content = origContent;
    let plainText = origContent;
    let hasContent = false;

    const htmlRegex = /(<([^>]+)>)/ig;
    const markedString = marked(content) || '';

    const cleanedString = markedString
      // Remove possibly added <p></p> tags and newline
      .replace(/(?:^<p>)|(?:<\/p>$)|(?:<\/p>\n$)/g, '')
      // Replace new lines between html elements
      .replace(/>\n</g, '><')
      .trim();

    if (cleanedString !== origContent) {
      hasContent = true;
      content = filterMarked(cleanedString);
      // Generate plain text from markdown
      plainText = cleanedString
        // insert removed line breaks between li elements
        .replace(/li><li/g, 'li>\n<li')
        // Strip html for plain text
        .replace(/(<([^>]+)>)/ig, '');
      // Convert escaped markdown html back to html for plaintext to remove markdown chars
      plainText = plainText.replace(/(&lt;|&gt;|&amp;|&#39;|&quot;)/g, (char) => {
        switch (char) {
          case '&lt;':
            return '<';
          case '&gt;':
            return '>';
          case '&amp;':
            return '&';
          case '&#39;':
            return "'";
          case '&quot;':
            return '"';
          default:
            return char;
        }
      });
      // After converting back, if nothing changed, we have pure plain text
      // Unless the markdown html has tags (like when sending a raw link)
      if (plainText === origContent && !content.match(htmlRegex)) {
        hasContent = false;
      }
    }
    if (!hasContent && content.match(htmlRegex)) {
      // If it has raw html but no markdown, we need to escape
      content = escapeSync(cleanedString);
      hasContent = true;
    }

    const {mentions, mentionsPlainText, mentionsText} = getMentions(content, plainText);

    if (mentions && mentions.length) {
      hasContent = true;
      messageObject.mentions = {
        items: mentions
      };
      content = mentionsText;
      plainText = mentionsPlainText;
    }


    // If we had to modify the original content, send converted
    if (hasContent) {
      messageObject.content = content;
    }
    messageObject.displayName = plainText;
  }

  return messageObject;
}

/**
* Helper to reset Activity store
*
* @param {Map} activity
* @param {function} dispatch
*/
export function cleanupAfterSubmit(activity, dispatch) {
  const files = activity.get('files');

  if (files.size) {
    files.forEach((file) => {
      revokeObjectURL(file);
    });
  }
  dispatch(resetActivity());
}
