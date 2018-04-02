import {assert} from 'chai';

import allMeetTests from '../../lib/constructors/meet';
import {
  createTestUsers,
  createSpace
} from '../../lib/sdk';
import MeetWidgetPage from '../../lib/widgets/space/meet';


describe('Widget Space: One on One - Meet', function meetTests() {
  const localPage = new MeetWidgetPage({aBrowser: browser.select('1')});
  const remotePage = new MeetWidgetPage({aBrowser: browser.select('2')});

  let mccoy, spock, space;

  before('initialize test users', function intializeUsers() {
    [mccoy, spock] = createTestUsers(2);
    localPage.user = mccoy;
    remotePage.user = spock;

    browser.call(() => spock.spark.internal.device.register());

    assert.exists(mccoy.spark, 'failed to create mccoy test user');
    assert.exists(spock.spark.internal.device.userId, 'failed to register spock devices');
  });

  it('can create one on one space', function createOneOnOneSpace() {
    this.retries(2);
    space = createSpace({
      sparkInstance: spock.spark,
      participants: [spock, mccoy]
    });
    assert.exists(space.id, 'failed to create one on one space');
  });

  allMeetTests({
    localPage,
    remotePage,
    isGroup: false
  });
});
