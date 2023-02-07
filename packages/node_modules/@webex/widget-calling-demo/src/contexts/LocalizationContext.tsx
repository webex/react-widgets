import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../localization/i18n';

export interface ILocalizationProvider {
  language: string;
  children: React.ReactNode;
}

/**
 *
 * @param root0
 * @param root0.localization
 * @param root0.children
 * @param root0.language
 */
export const LocalizationProvider = ({
  language,
  children,
}: ILocalizationProvider) => {
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
