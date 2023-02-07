/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
import { SliderState, SliderStateOptions, useSliderState } from 'react-stately';

import {
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from 'react-aria';
import React, { MutableRefObject, useRef } from 'react';
import useWebexClasses from '../../hooks/useWebexClasses';
import './ScrubbingBar.styles.scss';

type IScrubbingBarThumbProps = {
  state: SliderState;
  index: number;
  trackRef: MutableRefObject<HTMLDivElement | null>;
  className?: string;
};

/**
 *
 * @param props
 * @param props.state
 * @param props.trackRef
 * @param props.index
 * @param props.className
 */
const ScrubbingBarThumb = ({
  state,
  trackRef,
  index,
  className = undefined,
}: IScrubbingBarThumbProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { thumbProps, inputProps } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
    },
    state
  );

  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div
      {...thumbProps}
      className={`${className} ${isFocusVisible ? 'focus' : ''}`}
      style={{
        left: `calc(calc(100% - 16px) * ${state.getThumbPercent(index)})`,
      }}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
};

export interface IScrubbingBarProps
  extends Partial<SliderStateOptions<number[]>> {
  numberFormatOptions?: unknown;
}

export const ScrubbingBar = ({ ...rest }: IScrubbingBarProps) => {
  const [cssClasses, sc] = useWebexClasses(
    'voicemail-scrubbing-bar',
    undefined,
    {
      disabled: !!rest.isDisabled,
    }
  );
  const trackRef = React.useRef(null);
  const numberFormatted = useNumberFormatter();
  const state = useSliderState({
    numberFormatter: numberFormatted,
    ...rest,
  });
  const { groupProps, trackProps } = useSlider(rest, state, trackRef);

  return (
    <div {...groupProps} className={cssClasses}>
      <div {...trackProps} ref={trackRef} className={sc('track')}>
        <div
          className={sc('viewed')}
          style={{ width: `${state.getThumbPercent(0) * 100}%` }}
        />
        <ScrubbingBarThumb
          index={0}
          state={state}
          trackRef={trackRef}
          className={sc('thumb')}
        />
      </div>
    </div>
  );
};
