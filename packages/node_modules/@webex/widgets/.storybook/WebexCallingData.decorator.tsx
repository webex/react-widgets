import * as React from 'react';
import { WebexCallingDataProvider } from '../src';
import { SDKJSONAdapter } from '../src/adapters/JSONAdapters';
import { faker } from '@faker-js/faker';

faker.seed(1000);

const jsonAdapter = new SDKJSONAdapter({});

const WebexCallingDataDecorator = (Story, { globals }) => {
  const { display, theme, language } = globals;

  const displayProperties =
    display === 'Flex'
      ? {
          alignItems: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
        }
      : {};

  return (
    <WebexCallingDataProvider
      id="theme-provider"
      theme={theme}
      style={{
        backgroundColor: 'var(--theme-background-solid-primary-normal)',
        color: 'var(--theme-text-primary-normal)',
        height: '90vh',
        overflow: 'hidden',
        padding: '2rem',
        width: 'auto',
        //width: 'calc(100% - 3rem)', //1rem reserved for scrollbar
        ...displayProperties,
      }}
      language={language}
      adapter={jsonAdapter}
    >
      <Story />
    </WebexCallingDataProvider>
  );
};

export default WebexCallingDataDecorator;
