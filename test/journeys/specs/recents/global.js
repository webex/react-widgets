import recentTests from './base';

recentTests({
  name: 'Widget Recents: Global',
  browserLocalSetup({aBrowser, accessToken}) {
    aBrowser
      .url('/recents.html')
      .execute(() => {
        localStorage.clear();
      });
    aBrowser.execute((localAccessToken) => {
      const options = {
        accessToken: localAccessToken,
        onEvent: (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        }
      };
      window.openRecentsWidget(options);
    }, accessToken);
  }
});

