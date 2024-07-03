import React, { useEffect, useRef, useState } from 'react';
import { ButtonDialpad } from '@momentum-ui/react-collaboration';
import './NumberPad.scss';
import useWebexClasses from './hooks/useWebexClasses';
import { useGridFocus } from './hooks/useGridFocus';
import { longPressDuration, longPressHandledValues } from './utils/WebexDialPad'
import { useTranslation } from 'react-i18next';

const dialPadButtonTexts = [
  {
    value: '1',
    letters: undefined,
  },
  {
    value: '2',
    letters: 'ABC',
  },
  {
    value: '3',
    letters: 'DEF',
  },
  {
    value: '4',
    letters: 'GHI',
  },
  {
    value: '5',
    letters: 'JKL',
  },
  {
    value: '6',
    letters: 'MNO',
  },
  {
    value: '7',
    letters: 'PQRS',
  },
  {
    value: '8',
    letters: 'TUV',
  },
  {
    value: '9',
    letters: 'WXYZ',
  },
  {
    value: '*',
    letters: ',',
  },
  {
    value: '0',
    letters: '+',
  },
  {
    value: '#',
    letters: undefined,
  },
];

export interface INumPadProps {
  onButtonPress: (value: string) => void;
  disabled?: boolean;
}

/**
 * Number pad containing 0-9, #, and *.  Also contains sub-lettering
 *
 * @param {INumPadProps} props props for the NumberPad element
 * @param {Function} props.onButtonPress callback to be called whenever a button is pressed
 * @returns {React.Component} React component
 */
export const NumberPad = ({
  onButtonPress,
  disabled = false,
}: INumPadProps): JSX.Element => {
  const [cssClasses] = useWebexClasses('number-pad');
  const childrenRef = useRef<HTMLButtonElement[]>([]);
  const { setFocused, keyboardProps } =
    useGridFocus<HTMLButtonElement>(childrenRef);
    const numberPadRef = useRef<HTMLDivElement>(null);
    const [isNumberPadFocused, setNumberPadFocused] = useState(false); 
    const [buttonPressStart, setButtonPressStart] = useState(0);
    const NUMBER_PAD_FOCUSED = 'NumberPadFocused';
    const SEARCH_INPUT_FOCUSED = 'SearchInputFocused';
    const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>();
    const { t } = useTranslation();

    const onPress = (value: string) => {
      //Will pass the primary value of the dialpad button 
      //If button pressed is other than '0' or '*', 
      //If the button pressed is '0' or '*' but the duration of press is less than our predetermined duration of press to consider it as a long press.
      if (!longPressHandledValues.includes(value) || (longPressHandledValues.includes(value) && (Date.now() - buttonPressStart) < longPressDuration)) {
        timeoutID && clearTimeout(timeoutID);
        onButtonPress(value);
      }
    }

    const onPressStart = (value: string, letters: string | undefined) => {
      //Storing the exact time when the press starts
      setButtonPressStart(Date.now());
      //Will set the timer for long press only for '0' and '*' buttons in dialpad
      if (longPressHandledValues.includes(value)) {
        let timer = setTimeout(() => {
          // If the duration of press exceeds or is equal to our predetermined duration (duration after which we will consider a press as long press) 
          // will automatically set the search input value to secondary content of dialpad element i.e letters.
          if ((Date.now() - buttonPressStart) >= longPressDuration) {
            letters && onButtonPress(letters);
            clearTimeout(timer);
          }
        }, longPressDuration);
        setTimeoutID(timer);
      }
    }

    useEffect(() => {
      const handleFocusIn = (event: FocusEvent) => {
        if (numberPadRef.current?.contains(event.target as Node)) {
          const focusedButtonValue = (event.target as HTMLButtonElement)?.textContent;
          if (focusedButtonValue === '1') {
            setNumberPadFocused(true);
            localStorage.setItem(NUMBER_PAD_FOCUSED, JSON.stringify(true));
            window.dispatchEvent(new Event('storage'));
          } else {
            setNumberPadFocused(false);
            localStorage.removeItem(NUMBER_PAD_FOCUSED);
          }
        } else {
          setNumberPadFocused(false);
          localStorage.removeItem(NUMBER_PAD_FOCUSED);
        }
      };
  
      document.addEventListener('focusin', handleFocusIn);
  
      return () => {
        document.removeEventListener('focusin', handleFocusIn);
      };
    }, []); 


    useEffect(() => {
      // handler object
      const handleEvent = (event: KeyboardEvent) => {
        if (numberPadRef.current?.contains(event.target as Node)) {
        if (event.key === "Tab" && event.shiftKey) {             
            localStorage.setItem(SEARCH_INPUT_FOCUSED, JSON.stringify(true));
            window.dispatchEvent(new Event('storage'));               
          } else {
            localStorage.removeItem(SEARCH_INPUT_FOCUSED);
         }          
        } else {
          localStorage.removeItem(SEARCH_INPUT_FOCUSED);
       }       
      };
   
      // register handler
      window.addEventListener('keyup', handleEvent);
    
      // unregister handler
      return () => {
        window.removeEventListener('keyup', handleEvent);
      };
    }, []);

    useEffect(() => {
      return () => {
        // Clear timeout on unmount to prevent memory leaks
        if (timeoutID) {
          clearTimeout(timeoutID);
        }
      };
    }, []);
    

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={cssClasses} {...keyboardProps} ref={numberPadRef}>
      {dialPadButtonTexts.map(({ value, letters }, index) => (
        <ButtonDialpad
          aria-label={value === "1" ? t("label.dialPad.number") + value : value}
          key={value}
          primaryText={value}
          secondaryText={letters}
          size={64}
          onPress={() => {
            onPress(value)
          }}
          ref={(ref: HTMLButtonElement) => {
            childrenRef.current[index] = ref;
          }}
          onFocus={() => {
            setFocused(index);
            setNumberPadFocused(true);
          }}
          onBlur={() => {
            setFocused(undefined);
            setNumberPadFocused(false);
          }} 
          disabled={disabled}
          onPressStart={() => {
            onPressStart(value, letters)
          }}
        />
      ))}
    </div>
  );
};
