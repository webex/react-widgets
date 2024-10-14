import React from 'react';
import { Flex, Text } from '@momentum-ui/react-collaboration';
import useWebexClasses from './hooks/useWebexClasses';

type Props = {
  message: string | undefined;
};

/**
 * Banner for displaying empty call history.
 *
 * @param {string} message The message to display to the user
 * @returns {React.Component} React component
 */
export const NoHistory = ({ message }: Props) => {
  const [cssClasses, sc] = useWebexClasses('call-history-empty');
  return (
    <Flex
      className={cssClasses}
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <div className={sc('icon')}>
        <svg
          width="105"
          height="114"
          viewBox="0 0 105 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M85.1424 112.316L103.032 85.4498C105.292 82.0269 102.838 77.4415 98.7049 77.4415H88.9528C88.9528 77.4415 87.0153 68.3998 90.2445 61.9415C92.182 58.0665 96.057 55.4831 96.057 47.7331C96.057 39.9831 93.4737 38.6915 93.4737 34.8165C93.4737 31.5873 95.4112 29.6498 96.7028 28.3581L99.0278 26.0331C99.8674 25.1936 99.2862 23.8373 98.1237 23.8373H96.7028C97.9945 20.6081 95.4112 19.3165 95.4112 19.3165L90.2445 24.4831C86.6924 24.4831 83.7862 27.3894 83.7862 30.9415H79.3299C78.9424 30.9415 78.6195 31.2644 78.6841 31.6519C79.0716 34.1706 81.2028 36.1081 83.7862 36.1081C83.7862 45.1498 74.7445 49.6706 69.5778 57.4206C66.9945 61.2956 64.4112 67.1081 64.4112 73.5665C58.7278 73.5665 54.0778 68.9165 54.0778 63.2331C54.0778 61.7477 54.4653 60.1977 54.9174 59.0352C55.1112 58.5831 54.7237 58.0665 54.2716 58.1956C49.3633 58.9061 43.7445 64.3956 43.7445 71.0477C43.7445 80.0894 52.7862 85.9019 65.7028 85.9019C68.932 85.9019 70.8695 84.6102 70.8695 82.6727C70.8695 80.7352 68.932 79.4436 65.7028 79.4436C53.432 79.4436 21.7862 93.6519 1.11951 109.152M10.807 1.4269C7.83617 1.10398 4.92992 1.23315 2.15284 1.8144C1.50701 1.94356 1.44242 2.78315 2.08826 3.04148C12.9383 7.04565 20.6237 17.4436 20.6237 29.7144C20.6237 41.9206 12.9383 52.3186 2.08826 56.3227C1.50701 56.5811 1.57159 57.4206 2.21742 57.5498C4.02576 57.8727 5.83409 58.0665 7.70701 58.0665C23.982 58.0665 37.0278 44.4394 36.0591 27.9706C35.2195 14.279 24.4987 2.91231 10.807 1.4269Z"
            stroke="url(#paint0_linear_2611_89551)"
            strokeWidth="1.61458"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient
              id="paint0_linear_2611_89551"
              x1="52.506"
              y1="1.25391"
              x2="52.506"
              y2="112.316"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#93C437" />
              <stop offset="1" stopColor="#279BE8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <Text type="body-secondary" className={sc('message')}>
        {message}
      </Text>
    </Flex>
  );
};
