import globals from './globals';
import WebexCallingDataDecorator from './WebexCallingData.decorator';

export const globalTypes = { ...globals };

export const decorators = [WebexCallingDataDecorator];


export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  layout: 'fullscreen',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /(date|time|updated)$/i,
    },
  },
  chromatic: {
    delay: 500
  }
};
