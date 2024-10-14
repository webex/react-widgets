import {Record} from 'immutable';

const Membership = Record({
  audioMuted: false,
  isInitiator: true,
  hydraId: '',
  id: '',
  state: '',
  videoMuted: false
});

export function releaseCamera(mediaStream) {
  return mediaStream.getTracks().forEach((track) => track.stop());
}

export function constructCallObject(call) {
  let remoteAudioStream = null;
  let remoteVideoStream = null;
  let activeParticipantsCount = 0;
  let startTime;
  const memberships = [];

  if (call?.remoteMediaStream?.getAudioTracks) {
    remoteAudioStream = new MediaStream(call.remoteMediaStream.getAudioTracks());
  }
  if (call?.remoteMediaStream?.getVideoTracks) {
    remoteVideoStream = new MediaStream(call.remoteMediaStream.getVideoTracks());
  }
  if (call?.members?.membersCollection?.members) {
    Object.values(call.members.membersCollection.members).forEach((m) => {
      // only count user as active participant if they are connected
      if (m.isInMeeting) {
        activeParticipantsCount += 1;
      }

      memberships.push(Membership({
        audioMuted: m.audioMuted,
        isInitiator: m.isInitiator,
        hydraId: m.personId,
        id: m.id,
        state: m.status,
        videoMuted: m.videoMuted
      }));
    });
  }

  if (call.locusInfo?.fullState?.lastActive) {
    startTime = Date.parse(call.locusInfo?.fullState?.lastActive);
  }
  else {
    startTime = Date.now();
  }

  return {
    instance: call,
    locusUrl: call.locusUrl,
    direction: call.direction,
    remoteMediaStream: call.remoteMediaStream,
    localMediaStream: call.localMediaStream,
    isActive: call.isActive,
    hasJoinedOnThisDevice: call.state === 'JOINED',
    isReceivingAudio: call.receivingAudio,
    isReceivingVideo: call.receivingVideo,
    isSendingAudio: call.sendingAudio,
    isSendingVideo: call.sendingVideo,
    isDeclined: call.state === 'DECLINED',
    isRinging: call.type === 'CALL' && call.partner?.state !== 'JOINED',
    isInitiated: !!call.locusUrl,
    isConnected: (call.type === 'CALL' || call.locusInfo?.fullState?.type === 'CALL')
      ? call.partner?.state === 'JOINED' && call.state === 'JOINED'
      : call.state === 'JOINED',
    isIncoming: call.direction === 'in' && call.state !== 'JOINED',
    startTime,
    memberships,
    activeParticipantsCount,
    remoteAudioStream,
    remoteVideoStream
  };
}
