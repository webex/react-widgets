import recentTests from './base';

recentTests({
  name: 'Global',
  browserSetup({aBrowser, accessToken, toPersonEmail}) {
    aBrowser
      .url('/space.html?message')
      .execute(() => {
        localStorage.clear();
      });

    aBrowser.execute((localAccessToken, localToUserEmail) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        },
        toPersonEmail: localToUserEmail,
        initialActivity: 'message'
      };
      window.openSpaceWidget(options);
    }, accessToken, toPersonEmail);
  }
});
