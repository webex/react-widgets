import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('widget-message redux actions', () => {
  it('has exported actions', () => {
    expect(actions).toMatchSnapshot();
  });

  describe('basic actions', () => {
    describe('#resetWidgetState', () => {
      it('should reset the widget', () => {
        const store = mockStore({});

        store.dispatch(actions.resetWidgetState());
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    describe('#setScrollPosition', () => {
      it('should set the scroll position', () => {
        const store = mockStore({});

        store.dispatch(actions.setScrollPosition({scrollPosition: 0}));
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    describe('#updateWidgetState', () => {
      it('should store the activity types', () => {
        const store = mockStore({});

        store.dispatch(actions.updateWidgetState({mocked: true}));
        expect(store.getActions()).toMatchSnapshot();
      });
    });
  });

  describe('thunked actions', () => {
    describe('#showScrollToBottomButton', () => {
      it('should update widget state to show scroll button', () => {
        const store = mockStore({});

        store.dispatch(actions.showScrollToBottomButton(true));
        expect(store.getActions()).toMatchSnapshot();
      });
    });
  });
});
