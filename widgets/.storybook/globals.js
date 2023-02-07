import {
  DEFAULTS,
  THEME_NAMES,
} from '@momentum-ui/react-collaboration/src/components/ThemeProvider/ThemeProvider.constants';

const languageNames = new Intl.DisplayNames(['en'], {
  type: 'language',
});

const localeJSONs = require.context(
  '../src/localization/locales',
  true,
  /\.json$/
);
const localesToAddFromDirectory = localeJSONs
  .keys()
  .map((filename) => filename.split('/')[1])
  .filter((code, index, array) => array.indexOf(code) === index)
  .sort();

const globals = {
  display: {
    name: 'Display',
    description: 'Select the display type for Stories',
    defaultValue: 'Block',
    toolbar: {
      icon: 'structure',
      items: ['Block', 'Flex'],
      showName: true,
    },
  },
  theme: {
    name: 'Theme',
    description: "Select the component's theme",
    defaultValue: DEFAULTS.THEME,
    toolbar: {
      icon: 'paintbrush',
      items: [...Object.values(THEME_NAMES)],
      showName: true,
    },
  },
  language: {
    name: 'Language',
    description: "Select the component's language",
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: localesToAddFromDirectory.map((code) => ({
        value: code,
        title: languageNames.of(code),
        right: code,
      })),
      showName: true,
    },
  },
};

export default globals;
