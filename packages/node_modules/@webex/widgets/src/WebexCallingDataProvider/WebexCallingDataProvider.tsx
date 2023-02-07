import React from 'react';
import { ThemeProvider } from '@momentum-ui/react-collaboration';
import { Settings } from 'luxon';
import { AdapterProvider, IAdapterProvider } from '../contexts/AdapterContext';
import {
  ILocalizationProvider,
  LocalizationProvider,
} from '../contexts/LocalizationContext';

export interface IThemeProvider {
  id: string;
  style: React.CSSProperties;
  theme: 'darkWebex' | 'lightWebex';
  children: React.ReactNode;
}

interface IWebexCallingDataProvider
  extends IAdapterProvider,
    Partial<IThemeProvider>,
    Partial<ILocalizationProvider> {
  children: React.ReactNode;
}

/**
 * Provides an adapter context to the wrapped component.
 *
 * @param {IWebexCallingDataProvider} props  Data passed to the provider
 * @param {IAdapterContext} props.adapter  Adapter for context
 * @param {React.ReactNode} props.children  Component children to wrap
 * @param props.language
 * @param props.theme
 * @param props.style
 * @param props.id
 * @returns {React.Component} Component with access to the adapter context
 */
export const WebexCallingDataProvider = ({
  adapter,
  language = 'en',
  theme = 'lightWebex',
  style,
  id,
  children,
}: IWebexCallingDataProvider) => {
  Settings.defaultLocale = language;

  return (
    <ThemeProvider theme={theme} style={style} id={id}>
      <LocalizationProvider language={language}>
        <AdapterProvider adapter={adapter}>{children}</AdapterProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
