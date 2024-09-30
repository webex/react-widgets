import {filterActivities, normalizeActivity, normalizeActivities} from './helpers';

describe('redux-module-conversation helpers tests', () => {
  let giphyShareActivity, postActivity;

  beforeEach(() => {
    postActivity = {
      id: 'abc-123',
      actor: {},
      object: {
        objectType: 'comment',
        displayName: '11'
      },
      published: 1505420755171,
      verb: 'post',
      url: 'http://activity.url/abc-123',
      mock: true
    };
    giphyShareActivity = {
      id: 'abc-123',
      actor: {},
      object: {
        contentCategory: 'images',
        displayName: '',
        files: {
          items: [
            {
              displayName: 'this is a gif from giphy',
              fileSize: 123456,
              image: {
                height: 180,
                width: 360
              },
              mimeType: 'image/gif',
              objectType: 'file',
              scr: {
                loc: 'https://media1.giphy.com/media/3ohhwimgvkNEFyb2Ao/giphy.gif'
              },
              url: 'https://giphy.com'
            }
          ]
        },
        objectType: 'content'
      },
      published: 1505420755171,
      verb: 'share',
      url: 'http://activity.url/abc-123',
      mock: true
    };
  });

  describe('#filterActivities', () => {
    it('should filter content update activities', () => {
      const filteredActivities = filterActivities([
        {
          id: 'abc-123',
          object: {
            objectType: 'comment',
            displayName: '11'
          },
          published: 1505420755171,
          url: 'http://activity.url/abc-123',
          mock: true
        },
        {
          id: 'abc-123-filter-me',
          object: {
            objectType: 'content',
            displayName: '11'
          },
          published: 1505420755171,
          url: 'http://activity.url/abc-123',
          verb: 'update',
          mock: true,
          note: 'this should not be in snapshot'
        }
      ]);

      expect(filteredActivities.some((a) => a.verb === 'update')).toBe(false);
    });

    it('should not filter content activities', () => {
      const filteredActivites = filterActivities([
        {
          id: 'abc-123',
          object: {
            objectType: 'comment',
            displayName: '11'
          },
          published: 1505420755171,
          url: 'http://activity.url/abc-123',
          mock: true
        },
        {
          id: 'abc-123-dont-filter-me-bro',
          object: {
            objectType: 'content',
            displayName: '11'
          },
          published: 1505420755171,
          url: 'http://activity.url/abc-123',
          verb: 'share',
          mock: true,
          note: 'this should be in snapshot'
        }
      ]);

      expect(filteredActivites.length).toBe(2);
    });

    it('should filter reply activities', () => {
      const replyActivity = {
        id: 'abc-123',
        actor: {},
        object: {
          objectType: 'comment',
          displayName: '11'
        },
        published: 1505420755171,
        type: 'reply',
        verb: 'post',
        url: 'http://activity.url/abc-123',
        mock: true,
        note: 'this should not be in snapshot'
      };

      const filteredActivites = filterActivities([
        postActivity,
        replyActivity
      ]);

      expect(filteredActivites.length).toBe(1);
      expect(filteredActivites.some((a) => a.type === 'reply')).toBe(false);
    });
  });

  describe('#normalizeActivity', () => {
    it('should not convert a post activity', () => {
      expect(normalizeActivity(postActivity)).toMatchSnapshot();
    });

    it('should convert a giphy share activity', () => {
      expect(normalizeActivity(giphyShareActivity)).toMatchSnapshot();
    });
  });

  describe('#normalizeActivities', () => {
    it('should convert an array of activities', () => {
      expect(normalizeActivities([postActivity, giphyShareActivity])).toMatchSnapshot();
    });
  });
});
