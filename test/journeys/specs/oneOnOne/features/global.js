import oneOnOneFeatureTests from './base';

oneOnOneFeatureTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, toPersonEmail}) {
    aBrowser
      .url('/space.html?basic')
      .execute(() => {
        localStorage.clear();
      });
    aBrowser.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        toPersonEmail: localToUserEmail,
        initialActivity: 'message'
      };
      window.openWidget(options);
    }, accessToken, toPersonEmail);
  }
});
