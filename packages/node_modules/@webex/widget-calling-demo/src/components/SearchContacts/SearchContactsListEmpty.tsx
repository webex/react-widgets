import { Flex, Text } from '@momentum-ui/react-collaboration';
import React from 'react';
import useWebexClasses from '../../hooks/useWebexClasses';

type SearchContactsListEmptyProps = {
  noContactsFoundMessage: string;
  style?: React.CSSProperties;
};

/**
 *
 * @param root0
 * @param root0.noContactsFoundMessage
 * @param root0.style
 */
export const SearchContactsListEmpty = ({
  noContactsFoundMessage,
  style = undefined,
}: SearchContactsListEmptyProps) => {
  const [cssClasses, sc] = useWebexClasses('search-contacts-list--empty');

  return (
    <Flex className={cssClasses} style={style} xgap="1rem">
      <svg
        width="64"
        height="57"
        viewBox="0 0 64 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.6224 35.2331V36.5664C22.6224 37.5997 21.4224 38.3664 20.3224 37.5331C19.4891 36.4331 20.2557 35.2331 21.2891 35.2331H22.6224ZM22.6224 35.2331V16.2331C22.6224 14.0331 20.8224 12.2331 18.6224 12.2331C16.4224 12.2331 14.6224 14.0331 14.6224 16.2331V27.8997C14.6224 28.9997 13.7224 29.8997 12.6224 29.8997C11.5224 29.8997 10.6224 28.9997 10.6224 27.8997V24.5664C10.6224 23.0997 9.4224 21.8997 7.95573 21.8997C6.48906 21.8997 5.28906 23.0997 5.28906 24.5664V27.8997C5.28906 31.9664 8.55573 35.2331 12.6224 35.2331H13.2891C14.0224 35.2331 14.6224 35.8331 14.6224 36.5664V51.8997C14.6224 54.0997 12.8224 55.8997 10.6224 55.8997H1.28906M22.6224 35.2331H24.6224C25.7224 35.2331 26.6224 34.3331 26.6224 33.2331V24.5664C26.6224 23.0997 27.8224 21.8997 29.2891 21.8997C30.7557 21.8997 31.9557 23.0997 31.9557 24.5664V33.2331C31.9557 37.2997 28.6891 40.5664 24.6224 40.5664H23.9557C23.2224 40.5664 22.6224 41.1664 22.6224 41.8997V51.8997C22.6224 54.0997 24.4224 55.8997 26.6224 55.8997H62.6224M29.6224 53.2331L31.2891 51.5664V47.8997C31.2891 47.1664 31.8891 46.5664 32.6224 46.5664H34.6224C35.3557 46.5664 35.9557 47.1664 35.9557 47.8997V51.5664L37.4891 53.0997C37.7557 53.3664 38.1557 53.3664 38.4224 53.0997L42.6224 48.8997V39.8997C42.6224 38.4331 43.8224 37.2331 45.2891 37.2331H49.2891C50.7557 37.2331 51.9557 38.4331 51.9557 39.8997V47.8997C51.9557 48.6331 52.5557 49.2331 53.2891 49.2331C54.0224 49.2331 54.6224 48.6331 54.6224 47.8997V43.8997C54.6224 43.1664 55.2224 42.5664 55.9557 42.5664C56.6891 42.5664 57.2891 43.1664 57.2891 43.8997V50.8997L59.6224 53.2331M58.6224 8.56641C58.6224 12.9847 55.0407 16.5664 50.6224 16.5664C46.2041 16.5664 42.6224 12.9847 42.6224 8.56641C42.6224 4.14813 46.2041 0.566406 50.6224 0.566406C55.0407 0.566406 58.6224 4.14813 58.6224 8.56641Z"
          stroke="url(#paint0_linear_3557_5568)"
          strokeWidth="1.04167"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3557_5568"
            x1="31.9557"
            y1="0.566406"
            x2="31.9557"
            y2="55.8997"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#93C437" />
            <stop offset="1" stopColor="#279BE8" />
          </linearGradient>
        </defs>
      </svg>
      <Text type="body-primary" data-color="secondary" className={sc('text')}>
        {noContactsFoundMessage}
      </Text>
    </Flex>
  );
};
