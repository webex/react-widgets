# Widget Localization

Our widgets use the [i18next] and [react-i18next] internationalization frameworks in order to provide localization.

## Folder structure

Our language files exist under the following path: src/localization/locales. In this folder, every language that we
support has its own folder. The folder structure supports language codes with and without regions. Within these language
folders, there are JSON files that map to a particular widget/component. In order to find which widget a piece of text
belongs to, please use our storybook (TODO: Add link).

## How to add a new language

### Base language (en)

To add a new base language, create a folder under locales with the base language code. The easiest way to bootstrap a
new language is to copy over all the files from another base language (probably best to copy those from en).  
Update all the strings in those files.

### Regional language (en-US)

Our frameworks support fallback languages, meaning if a regional language (en-UK) is missing a key-value pair, it will
fall back to the non-regional version (en). Therefore, we want a majority of the string values in the non-regional file
and only use the regional language for particular regional overrides. This prevents a lot of duplicated strings and
should hopefully make things easier on the localization and development teams.

Therefore, the recommendation is to create a new folder under locales, add the JSON file corresponding to the
widget/component that contains the text to upgrade, and just add the minimum number of overrides.

en/WebexWidget.json:

```
{
   "loading": "Loading...",
   "body": "Here is some body text in english"
}
```

en-US/WebexWidget.json:

```
{
   "body": "Body text targetted towards the USA that overrrides the en/WebexWidget.json body text"
}
```

### Add language option to storybook

Currently, our storybook is automatically configured to show the language options. When you add the folder for the new
language under src/localization/locales, the new language should automatically pop up!


[i18next]: <https://www.i18next.com/>

[react-i18next]: <https://react.i18next.com/>
