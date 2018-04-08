import {assert} from 'chai';

import {constructHydraId} from '../../hydra';

/**
 * Sends a file and verifies receipt
 * @param {Object} options
 * @param {Object} options.senderBrowser
 * @param {Object} options.receiverPage
 * @param {string} options.fileName
 * @param {boolean} [options.fileSizeVerify=true] Some files are embedded and don't display file sizes
 */
function sendFileTest({
  localPage, remotePage, fileName, fileSizeVerify = true
}) {
  localPage.sendFile(fileName);
  remotePage.hasFile(fileName);

  // Some files are embedded and don't display file sizes
  if (fileSizeVerify) {
    const localSize = localPage.fileSizeSelector;
    const remoteSize = remotePage.fileSizeSelector;
    assert.equal(localSize, remoteSize);
  }
  // Send receipt acknowledgement and verify before moving on
  const message = `Received: ${fileName}`;
  remotePage.sendMessage(message);
  localPage.verifyMessageReceipt(message);
}


/**
 * Test that sends a file and verifies that it is present in the files activity tab
 * @param {Object} options
 * @param {Object} options.senderBrowser
 * @param {Object} options.receiverPage
 * @param {string} options.fileName
 * @param {boolean} [options.hasThumbnail = true] Some files don't have a thumbnail
 */
function filesTabTest({
  localPage, remotePage, fileName, hasThumbnail = true
}) {
  localPage.verifyFilesActivityTab({fileName, hasThumbnail});
  remotePage.verifyFilesActivityTab({fileName, hasThumbnail});
}


/**
 * Test that verifies correct message events are created
 * @param {Object} options
 * @param {Object} options.senderBrowser
 * @param {Object} options.sender
 * @param {Object} options.receiverPage
 */
function messageEventTest({
  localPage, remotePage
}) {
  const message = 'God, I liked him better before he died.';
  remotePage.clearEventLog();
  localPage.sendMessage(message);
  remotePage.verifyMessageReceipt(message);

  const events = remotePage.getEventLog();

  const eventCreated = events.find((event) => event.eventName === 'messages:created');
  const eventUnread = events.find((event) => event.eventName === 'rooms:unread');

  assert.isDefined(eventCreated, 'has a message created event');
  assert.containsAllKeys(eventCreated.detail, ['resource', 'event', 'actorId', 'data']);
  assert.containsAllKeys(eventCreated.detail.data, ['actorId', 'actorName', 'id', 'personId', 'roomId', 'roomType', 'text']);
  assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', localPage.user.id));
  assert.equal(eventCreated.detail.data.actorName, localPage.user.displayName);

  assert.isDefined(eventUnread, 'has an unread message event');
  assert.containsAllKeys(eventUnread.detail, ['resource', 'event', 'data']);
  assert.containsAllKeys(eventUnread.detail.data, ['actorId', 'actorName', 'id', 'title', 'type', 'created', 'lastActivity']);
  assert.equal(eventCreated.detail.actorId, constructHydraId('PEOPLE', localPage.user.id));
  assert.equal(eventCreated.detail.data.actorName, localPage.user.displayName);
}


/**
 * Test for sending markdown message with bold text
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function bold(senderPage, receiverPage) {
  senderPage.sendMessage(
    '**Are you out of your Vulcan mind?** No human can tolerate the radiation that\'s in there!'
  );
  receiverPage.verifyMessageReceipt(
    'Are you out of your Vulcan mind? No human can tolerate the radiation that\'s in there!'
  );
  // Assert only the bolded text is in the strong tag
  assert.equal(receiverPage.getLastText('strong'), 'Are you out of your Vulcan mind?');
}

/**
 * Test for sending markdown message with italic text
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function italic(senderPage, receiverPage) {
  senderPage.sendMessage('As you are _so fond_ of observing, doctor, I am not human.');
  receiverPage.verifyMessageReceipt('As you are so fond of observing, doctor, I am not human.');
  // Assert only the italicized text is in the em tag
  assert.equal(receiverPage.getLastText('em'), 'so fond');
}

/**
 * Test for sending markdown message with a blockquote
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function blockquote(senderPage, receiverPage) {
  senderPage.sendMessage('> You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.\n\nYou call this relaxing? I\'m a nervous wreck. I\'m not careful, I\'ll end up talking to myself.');
  receiverPage.verifyMessageReceipt('You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.\nYou call this relaxing? I\'m a nervous wreck. I\'m not careful, I\'ll end up talking to myself.');
  // Assert only first half of message is in the blockquote tag
  assert.equal(receiverPage.getLastText('blockquote'), 'You\'ll have a great time, Bones. You\'ll enjoy your shore leave. You\'ll relax.');
}

/**
 * Test for sending markdown message with an ordered list
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function orderedList(senderPage, receiverPage) {
  senderPage.sendMessage('1. ordered list item 1\n2. ordered list item 2');
  receiverPage.verifyMessageReceipt('ordered list item 1\nordered list item 2');
  // Assert text matches for the first and second ordered list items
  assert.equal(receiverPage.getLastText('ol/li[1]'), 'ordered list item 1');
  assert.equal(receiverPage.getLastText('ol/li[2]'), 'ordered list item 2');
}

/**
 * Test for sending markdown message with an unordered list
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function unorderedList(senderPage, receiverPage) {
  senderPage.sendMessage('* unordered list item 1\n* unordered list item 2');
  receiverPage.verifyMessageReceipt('unordered list item 1\nunordered list item 2');
  // Assert text matches for the first and second unordered list items
  assert.equal(receiverPage.getLastText('ul/li[1]'), 'unordered list item 1');
  assert.equal(receiverPage.getLastText('ul/li[2]'), 'unordered list item 2');
}

/**
 * Test for sending markdown message with a h1 heading
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function heading1(senderPage, receiverPage) {
  senderPage.sendMessage('# Heading 1');
  receiverPage.verifyMessageReceipt('Heading 1');
  assert.equal(receiverPage.getLastText('h1'), 'Heading 1');
}

/**
 * Test for sending markdown message with a h2 heading
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function heading2(senderPage, receiverPage) {
  senderPage.sendMessage('## Heading 2');
  receiverPage.verifyMessageReceipt('Heading 2');

  assert.equal(receiverPage.getLastText('h2'), 'Heading 2');
}

/**
 * Test for sending markdown message with a h3 heading
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function heading3(senderPage, receiverPage) {
  senderPage.sendMessage('### Heading 3');
  receiverPage.verifyMessageReceipt('Heading 3');
  assert.equal(receiverPage.getLastText('h3'), 'Heading 3');
}

/**
 * Test for sending markdown message with a horizontal line
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function hr(senderPage, receiverPage) {
  senderPage.sendMessage('test horizontal line\n- - -');
  receiverPage.verifyMessageReceipt('test horizontal line');
  assert.isTrue(receiverPage.hasLastElement('hr'));
}

/**
 * Test for sending markdown message with a link
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function link(senderPage, receiverPage) {
  senderPage.sendMessage('[Cisco](http://www.cisco.com/)');
  receiverPage.verifyMessageReceipt('Cisco');
  assert.equal(receiverPage.getLastText('a'), 'Cisco');
  assert.equal(receiverPage.getLastElementAttribute('a', 'href'), 'http://www.cisco.com/');
}

/**
 * Test for sending markdown message with inline code
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function inline(senderPage, receiverPage) {
  senderPage.sendMessage('this tests `inline.code();`');
  receiverPage.verifyMessageReceipt('this tests inline.code();');
  assert.equal(receiverPage.getLastText('code'), 'inline.code();');
}

/**
 * Test for sending markdown message with a codeblock
 * @param {Object} senderPage
 * @param {Object} receiverPage
 */
function codeblock(senderPage, receiverPage) {
  senderPage.sendMessage('``` html\n<h1>Hello World!</h1>\n```');
  receiverPage.verifyMessageReceipt('<h1>Hello World!</h1>');
  assert.equal(receiverPage.getLastText('pre/code'), '<h1>Hello World!</h1>');
}

export default {
  sendFileTest,
  filesTabTest,
  messageEventTest,
  markdown: {
    bold,
    italic,
    blockquote,
    orderedList,
    unorderedList,
    heading1,
    heading2,
    heading3,
    hr,
    link,
    inline,
    codeblock
  }
};
