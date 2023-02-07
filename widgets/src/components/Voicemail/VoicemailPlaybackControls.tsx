import React from 'react';
import {
  ButtonCircle,
  Flex,
  IconNext,
  Text,
} from '@momentum-ui/react-collaboration';
import './VoicemailItem.styles.scss';
import { ScrubbingBar } from './ScrubbingBar';
import { useAudio } from '../../hooks/useAudio';
import { formatDuration } from '../../utils/dateUtils';
import useWebexClasses from '../../hooks/useWebexClasses';
import './VoicemailPlaybackControls.styles.scss';

export interface IVoicemailPlaybackControlsProps {
  audioSrc: string;
  onPlay?: () => void;
  className?: string;
  duration: number;
}

export const VoicemailPlaybackControls = ({
  audioSrc,
  onPlay = () => { },
  className = undefined,
  duration,
}: IVoicemailPlaybackControlsProps) => {
  const { curTime, playing, setPlaying, setClickedTime } =
    useAudio(audioSrc);
  const playAudio = () => {
    onPlay();
    setPlaying(true);
  };
  const [cssClasses, sc] = useWebexClasses('voicemail-playback-controls');

  return (
    <Flex
      xgap=".5rem"
      alignItems="center"
      className={`${className} ${cssClasses}`}
    >
      {playing ? (
        <ButtonCircle outline size={28} onPress={() => setPlaying(false)}>
          <IconNext name="pause" autoScale={150} />
        </ButtonCircle>
      ) : (
        <ButtonCircle outline size={28} onPress={playAudio}>
          <IconNext name="play" autoScale={150} className={sc('play-icon')} />
        </ButtonCircle>
      )}
      <Text className={sc('current-time')}>{formatDuration(curTime)}</Text>
      <ScrubbingBar
        maxValue={duration / 1000}
        value={[curTime]}
        onChange={([value]) => setClickedTime(value)}
        step={Math.min(duration / 1000, 0.1)}
        aria-label="voicemail scrubbing bar"
      />
      <Text>{formatDuration(duration / 1000)}</Text>
    </Flex>
  );
};
