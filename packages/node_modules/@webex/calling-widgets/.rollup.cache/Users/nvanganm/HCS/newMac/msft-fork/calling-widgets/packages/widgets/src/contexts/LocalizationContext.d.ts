import React from 'react';
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
export declare const LocalizationProvider: ({ language, children, }: ILocalizationProvider) => JSX.Element;
//# sourceMappingURL=LocalizationContext.d.ts.map