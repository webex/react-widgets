import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

i18next
  .use(
    resourcesToBackend((lng, ns, callback) => {
      import(`./locales/${lng}/${ns}.json`)
        .then((resources) => callback(null, resources))
        .catch((e) => callback(e, null));
    })
  )
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18next;
