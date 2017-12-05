import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '.';

const {initialState} = actions;
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


let file, fileObject, mockSpark, store;

describe('redux-module-share actions ', () => {
  beforeEach(() => {
    store = mockStore(initialState);
    fileObject = {
      displayName: 'Test-File.pdf',
      mimeType: 'application/pdf',
      fileSize: 12346,
      scr: {},
      url: 'https://files-api-a.wbx2.com',
      width: 100,
      height: 100
    };

    file = new Uint8Array();

    mockSpark = {
      internal: {
        conversation: {
          download: jest.fn(() => Promise.resolve(file))
        }
      }
    };
  });

  it('has exported actions', () => {
    expect(actions.retrieveSharedFile).toBeDefined();
  });


  describe('#retrieveSharedFile', () => {
    it('properly retrieves and returns file', () => {
      store.dispatch(actions.retrieveSharedFile(fileObject, mockSpark))
        .then((outputFile) => {
          expect(outputFile).toBe(file);
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });
});
