import React from 'react';

import ShallowRenderer from 'react-test-renderer/shallow';

import MeetingsWidget from './MeetingsWidget';

const renderer = new ShallowRenderer();

describe('MeetingsWidget component', () => {
  describe('when it has an error', () => {
    it('renders properly', () => {
      const error = {
        displayTitle: 'error title',
        displaySubtitle: 'error subtitle',
        temporary: false
      };

      renderer.render(
        <MeetingsWidget
          error={error}
        />
      );

      const component = renderer.getRenderOutput();

      expect(component).toMatchSnapshot();
    });
  });

  describe('when it is loading', () => {
    it('renders properly', () => {
      renderer.render(
        <MeetingsWidget
          isReady={false}
        />
      );

      const component = renderer.getRenderOutput();

      expect(component).toMatchSnapshot();
    });
  });

  describe('when the widget is ready', () => {
    const isReady = true;

    describe('when the meeting does not exist', () => {
      it('renders properly', () => {
        const destination = {
          avatarId: 'avatarId',
          avatarImage: 'avatarImage',
          joinButtonAriaLabel: 'joinButtonArialLabel',
          joinButtonLabel: 'joinButtonLabel',
          displayName: 'displayName'
        };

        renderer.render(
          <MeetingsWidget
            destination={destination}
            isReady={isReady}
            onJoinClick={jest.fn()}
          />
        );

        const component = renderer.getRenderOutput();

        expect(component).toMatchSnapshot();
      });
    });

    describe('when the meeting exists but not joined', () => {
      it('renders properly', () => {
        const destination = {
          avatarId: 'avatarId',
          avatarImage: 'avatarImage',
          joinButtonAriaLabel: 'joinButtonArialLabel',
          joinButtonLabel: 'joinButtonLabel',
          displayName: 'displayName'
        };

        renderer.render(
          <MeetingsWidget
            destination={destination}
            isReady={isReady}
            meetingStatus={{joined: false}}
            onJoinClick={jest.fn()}
          />
        );

        const component = renderer.getRenderOutput();

        expect(component).toMatchSnapshot();
      });
    });


    describe('when the meeting is active', () => {
      it('renders properly', () => {
        renderer.render(
          <MeetingsWidget
            isReady={isReady}
            meeting={{}}
            meetingMedia={{localVideoStream: {mock: true}, remoteVideoStream: {mock: true}}}
            meetingStatus={{joined: true}}
            onLeaveClick={jest.fn()}
          />
        );

        const component = renderer.getRenderOutput();

        expect(component).toMatchSnapshot();
      });
    });
  });
});

