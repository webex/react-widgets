import { useCallback, useEffect, useState } from 'react';

export const useAudio = (url: string, audioSrcLoader: boolean) => {
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
  }, [playing, url, audioSrcLoader]);

  // React state listeners: update DOM on React state changes
  useEffect(() => {
    if (audioSrcLoader) {
      if (playing && url) {
        audio.src = url;
        audio.pause();
        audio.load();
        audio.preload = 'auto'
        audio.crossOrigin = "anonymous";
        audio.addEventListener("canplaythrough", () => {
          url && audio.play();
        })
      } else {
        audio.removeEventListener("canplaythrough", () => {
          audio.pause();
        });
        audio.src = ''
      }
    } else {
      audio.removeEventListener("canplaythrough", () => {
        audio.pause();
      });
      audio.src = ''
      setPlaying(false)
    }
  }, [playing, url, audio, setCurTime, audioSrcLoader]);

  const setClickedTime = useCallback(
    (clickedTime: number) => {
      if (clickedTime !== curTime) {
        audio.currentTime = clickedTime;
        setCurTime(clickedTime);
      }
    },
    [url, audio, setCurTime, curTime, audioSrcLoader]
  );

  return { audio, curTime, duration, playing, setPlaying, setClickedTime };
};
