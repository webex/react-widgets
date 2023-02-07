import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { TextInput } from '@momentum-ui/react-collaboration';
import { useTranslation } from 'react-i18next';
import { IWebexIntContact } from '@webex-int/adapter-interfaces';
import useWebexClasses from '../hooks/useWebexClasses';
import { SearchContactsList } from '../components/SearchContacts/SearchContactsList';
import { useSearchDropdown } from '../hooks/useSearchDropdown';
import './WebexSearchContacts.styles.scss';

export interface IWebexSearchContactsProps {
  label?: string;
  noContactsFoundMessage?: string;
  style?: React.CSSProperties;
  minSearchLength?: number;
  onInputChange?: (input: string) => void;
  onUserSelect?: (user: IWebexIntContact | undefined) => void;
  onDropdownHide?: () => void;
  hideDropdownSource?: boolean;
}

export type WebexSearchContactsHandle = {
  appendValueToInput: (toAppend: string) => void;
};

/**
 * Description for this component.
 *
 * @param {IWebexSearchContactsProps} props Props for this component
 * @param props.style optional styles to add
 * @param props.label label to display in the search bar
 * @param props.noContactsFoundMessage text to output when no users are found
 * @param props.minSearchLength minimum text length required before searching
 * @param props.inputId id to make the search input
 */
export const WebexSearchContacts = forwardRef<
  WebexSearchContactsHandle,
  IWebexSearchContactsProps
>(
  (
    {
      label,
      noContactsFoundMessage,
      style,
      minSearchLength,
      onInputChange,
      onUserSelect,
      onDropdownHide,
      hideDropdownSource,
    },
    ref
  ) => {
    const [cssClasses, sc] = useWebexClasses('search-contacts-widget');
    const [inputValue, setInputValue] = useState<string>('');
    const { t } = useTranslation('WebexSearchContacts');
    const placeholder = label || t('search');

    const [clickRef, showDropdown] = useSearchDropdown<HTMLDivElement>(
      inputValue,
      minSearchLength!
    );

    useImperativeHandle(ref, () => ({
      appendValueToInput(toAppend: string) {
        setInputValue((prev) => prev + toAppend);
      },
    }));

    useEffect(() => {
      if (!showDropdown && onDropdownHide) {
        onDropdownHide();
      }
    }, [showDropdown, onDropdownHide]);

    useEffect(() => {
      if (onInputChange) {
        onInputChange(inputValue);
      }
    }, [inputValue, onInputChange]);

    return (
      <div className={cssClasses} style={style} ref={clickRef}>
        <TextInput
          className={sc('input')}
          placeholder={placeholder}
          aria-label={placeholder}
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          autoComplete="off"
        />
        {showDropdown && (
          <div
            className={sc('dropdown')}
            data-testid="webex-search-contacts-dropdown"
          >
            <SearchContactsList
              searchValue={inputValue}
              noContactsFoundMessage={
                noContactsFoundMessage || t('noContactsFound')
              }
              onUserSelect={onUserSelect}
              hideSource={hideDropdownSource}
            />
          </div>
        )}
      </div>
    );
  }
);

WebexSearchContacts.defaultProps = {
  label: undefined,
  noContactsFoundMessage: undefined,
  style: undefined,
  minSearchLength: 1,
  onInputChange: () => {},
  onUserSelect: () => {},
  onDropdownHide: () => {},
  hideDropdownSource: false,
};
