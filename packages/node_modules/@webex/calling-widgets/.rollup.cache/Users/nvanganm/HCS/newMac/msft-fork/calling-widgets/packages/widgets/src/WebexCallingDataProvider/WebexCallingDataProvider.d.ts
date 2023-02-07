import React from 'react';
import { IAdapterProvider } from '../contexts/AdapterContext';
import { ILocalizationProvider } from '../contexts/LocalizationContext';
export interface IThemeProvider {
    id: string;
    style: React.CSSProperties;
    theme: 'darkWebex' | 'lightWebex';
    children: React.ReactNode;
}
interface IWebexCallingDataProvider extends IAdapterProvider, Partial<IThemeProvider>, Partial<ILocalizationProvider> {
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
export declare const WebexCallingDataProvider: ({ adapter, language, theme, style, id, children, }: IWebexCallingDataProvider) => JSX.Element;
export {};
//# sourceMappingURL=WebexCallingDataProvider.d.ts.map