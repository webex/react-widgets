import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {of} from 'rxjs';

import {initialState, CallRecord} from './reducer';
import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let callInstance, callObject, mockSpark, store, callId, mockSdkAdapter, mockMeeting;

describe('redux-module-media actions ', () => {
  beforeEach(() => {
    callInstance = {
      hangup: jest.fn(() => Promise.resolve()),
      acknowledge: jest.fn(() => Promise.resolve()),
      reject: jest.fn(() => Promise.resolve()),
      answer: jest.fn(() => Promise.resolve()),
      once: jest.fn(),
      on: jest.fn((eventName, callback) => Promise.resolve({eventName, callback})),
      off: jest.fn(),
      locusInfo: {
        url: 'https://locusUrl',
        fullState: {
          lastActive: 'Sun Feb 18 2018 18:21:05 GMT'
        }
      },
      direction: '',
      joined: '',
      state: 'active',
      status: '',
      receivingAudio: '',
      sendingAudio: '',
      sendingVideo: '',
      remoteMediaStream: '',
      localMediaStream: '',
      remoteAudioMuted: '',
      remoteVideoMuted: '',
      remoteAudioStream: '',
      remoteVideoStream: ''
    };

    callId = 'abc-123';
    callObject = new CallRecord({
      id: callId,
      instance: callInstance,
      locusUrl: callInstance.locusUrl
    });

    mockSpark = {
      meetings: {
        on: jest.fn((eventName, callback) => Promise.resolve({eventName, callback}))
      },
      phone: {
        createLocalMediaStream: jest.fn(() => Promise.resolve()),
        dial: jest.fn(() => callInstance),
        listActiveCalls: jest.fn(() => Promise.resolve([callInstance])),
        on: jest.fn((eventName, callback) => Promise.resolve({eventName, callback})),
        isCallingSupported: jest.fn(() => Promise.resolve(true)),
        register: jest.fn(() => Promise.resolve())
      }
    };

    store = mockStore({media: initialState});

    mockMeeting = {
      id: 'mock-meeting',
      decline: jest.fn(() => Promise.resolve())
    };

    mockSdkAdapter = {
      meetingsAdapter: {
        meetings: {},
        datasource: {
          meetings: {
            getMeetingByType: jest.fn(() => mockMeeting)
          }
        },
        fetchMeetingTitle: jest.fn(() => Promise.resolve('Mock Title')),
        joinMeeting: jest.fn(),
        getLocalMedia: jest.fn(() => of({
          localAudio: 'localAudio',
          localVideo: 'localVideo'
        }))
      }
    };
  });

  it('has exported actions', () => {
    expect(actions).toMatchSnapshot();
  });

  describe('#acceptIncomingCall', () => {
    it('can successfully accept an incoming call', () =>
      store.dispatch(actions.acceptIncomingCall(callObject, {sdkAdapter: mockSdkAdapter, destinationId: 'test-id'}))
        .then(() => {
          expect(mockSdkAdapter.meetingsAdapter.joinMeeting).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        }));
  });

  describe('#declineIncomingCall', () => {
    it('can successfully decline an incoming call', () => {
      store.dispatch(actions.declineIncomingCall(callObject, {meetingsAdapter: mockSdkAdapter.meetingsAdapter}));
      expect(mockMeeting.decline).toHaveBeenCalled();
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#dismissIncomingCall', () => {
    it('can successfully dismiss an incoming call', () => {
      store.dispatch(actions.dismissIncomingCall('abc-123'));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#hangupCall', () => {
    it('can successfully hangup active call', () =>
      store.dispatch(actions.hangupCall({call: callInstance, id: callObject.id}))
        .then(() => {
          expect(callInstance.off).toHaveBeenCalled();
          expect(callInstance.hangup).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        }));
  });

  describe('#listenForCalls', () => {
    it('can successfully attach call:incoming listener', () =>
      store.dispatch(actions.listenForCalls(mockSpark))
        .then(() => {
          // Promise.all does not guarantee execution order in node
          // so we need to just check that the .on events were attached
          // at some point
          const onEvents = mockSpark.meetings.on.mock.calls.map((e) => e[0]);

          expect(onEvents).toContain('meeting:added');
          expect(store.getActions()).toMatchSnapshot();
        }));
  });

  describe('#placeCall', () => {
    it('can successfully call a user with email', () => {
      const options = {
        destination: 'test@webex.com',
        locusUrl: 'https://locusUrl'
      };

      store.dispatch(actions.placeCall(options, mockSpark))
        .then(() => {
          expect(mockSpark.phone.dial).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#storeCall', () => {
    it('stores a call', () => {
      const destination = 'abc@123.net';

      store.dispatch(actions.storeCall({call: callInstance, destination, id: callId}));
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});