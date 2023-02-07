import { useCallback, useEffect, useState } from 'react';

export const useAudio = (url: string) => {
  const [audio] = useState<HTMLAudioElement>(new Audio(url));
  const [duration, setDuration] = useState<number>(0);
  const [curTime, setCurTime] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    const setAudioData = () => {
      setDuration(audio.duration);
      setCurTime(audio.currentTime);
    };
    const setAudioTime = () => setCurTime(audio.currentTime);
    const onEnded = () => {
      setPlaying(false);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', onEnded);

    // effect cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audio]);

  // React state listeners: update DOM on React state changes
  useEffect(() => {
    if (playing) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playing, audio]);

  const setClickedTime = useCallback(
    (clickedTime: number) => {
      if (clickedTime !== curTime) {
        audio.currentTime = clickedTime;
        setCurTime(clickedTime);
      }
    },
    [audio, setCurTime, curTime]
  );

  return { audio, curTime, duration, playing, setPlaying, setClickedTime };
};
