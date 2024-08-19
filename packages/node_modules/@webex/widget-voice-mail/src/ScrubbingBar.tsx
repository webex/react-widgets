/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { formatSleekBarCurrTimeDurationForAnnouncement, formatVoiceMailTimeDurationForAnnouncement } from '@webex/widget-call-history/src/utils/voiceOver';

import React, { KeyboardEvent, MutableRefObject, forwardRef, useEffect, useRef, useState } from 'react';
import {
  VisuallyHidden,
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
} from 'react-aria';
import { useTranslation } from 'react-i18next';
import { SliderState, SliderStateOptions, useSliderState } from 'react-stately';
import './ScrubbingBar.styles.scss';
import useWebexClasses from './hooks/useWebexClasses';

type IScrubbingBarThumbProps = {
  state: SliderState;
  index: number;
  trackRef: MutableRefObject<HTMLDivElement | null>;
  className?: string;
  currTime?: number[];
};

/**
 *
 * @param props
 * @param props.state
 * @param props.trackRef
 * @param props.index
 * @param props.className
 */
const ScrubbingBarThumb = forwardRef<HTMLDivElement, IScrubbingBarThumbProps>(({
  state,
  trackRef,
  index,
  className = undefined,
  currTime
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { thumbProps, inputProps } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
    },
    state
  );

  const { focusProps } = useFocusRing();
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && trackRef.current) {
      trackRef.current.focus();
    }
  };

  return (
    <div
      data-testid="scrubbing-bar-thumb"
      {...mergeProps(thumbProps, focusProps)}
      className={`${className} ${isFocused ? 'vm-focus-ring-wrapper' : ''}`}
      style={{
        left: `calc(calc(100% - 16px) * ${state.getThumbPercent(index)})`,
      }}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        thumbProps.onKeyDown?.(e);
        handleKeyDown(e);
      }}
      role="slider"
      aria-valuenow={currTime ? currTime[0] : 0}
      aria-valuetext={currTime ? `${formatSleekBarCurrTimeDurationForAnnouncement(currTime[0] * 1000)}` : ""}
      ref={ref}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...inputProps} />
      </VisuallyHidden>
    </div>
  );
});

export interface IScrubbingBarProps
  extends Partial<SliderStateOptions<number[]>> {
  numberFormatOptions?: unknown;
  duration?: number;
  voicemailName?: string;
  playButtonRef: React.RefObject<HTMLButtonElement>;
  pauseButtonRef: React.RefObject<HTMLButtonElement>;
  audioButtonRef: React.RefObject<HTMLButtonElement>;
  trackRef: React.RefObject<HTMLDivElement>;
}

export const ScrubbingBar = ({ playButtonRef, pauseButtonRef, audioButtonRef, trackRef, ...rest }: IScrubbingBarProps) => {
  const [cssClasses, sc] = useWebexClasses(
    'voicemail-scrubbing-bar',
    undefined,
    {
      disabled: !!rest.isDisabled,
    }
  );
  const thumbRef = useRef<HTMLDivElement>(null);
  const numberFormatted = useNumberFormatter();
  const state = useSliderState({
    numberFormatter: numberFormatted,
    ...rest,
  });
  const { groupProps, trackProps } = useSlider(rest, state, trackRef);
  const { t } = useTranslation('WebexVoicemail');
  const { isFocusVisible, focusProps } = useFocusRing();

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.focus();
    }
  }, []);

  const handleTrackKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && thumbRef.current) {
      thumbRef.current.focus();
    } else if (event.key === 'ArrowRight' && audioButtonRef.current) {
      event.preventDefault();
      event.stopPropagation();
      audioButtonRef.current.focus();
    } else if (event.key === 'ArrowLeft' && playButtonRef.current) {
      event.preventDefault();
      event.stopPropagation();
      playButtonRef.current.focus();
    }
  };

  return (
    <div {...groupProps} className={cssClasses} data-testid="scrubbing-bar" aria-label={`${t('voicemailFrom')} ${rest.voicemailName}, ${t('slider')}, 0 minute 0 second of  ${rest.duration ? (formatVoiceMailTimeDurationForAnnouncement(rest.duration as number)) : '0'}`}>
      <div
       {...mergeProps(trackProps, focusProps)}
        ref={trackRef}
        className={sc('track')}
        tabIndex={0}
        onKeyDown={handleTrackKeyDown}
        style={{
          boxShadow: isFocusVisible ? 'var(--md-globals-focus-ring-box-shadow)' : undefined,
          outline: isFocusVisible ? 'var(--md-globals-focus-ring-outline)' : undefined,
        }}
      >
        <div
          className={sc('viewed')}
          style={{ width: `${state.getThumbPercent(0) * 100}%` }}
        />
        <ScrubbingBarThumb
          index={0}
          state={state}
          trackRef={trackRef}
          className={sc('thumb')}
          currTime={rest.value}
          ref={thumbRef}
        />
      </div>
    </div>
  );
};
