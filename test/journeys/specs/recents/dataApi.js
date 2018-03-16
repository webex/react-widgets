import recentTests from './base';

recentTests({
  name: 'Widget Recents: Data API',
  browserLocalSetup({aBrowser, accessToken}) {
    aBrowser
      .url('/data-api/recents.html')
      .execute(() => {
        localStorage.clear();
      });
    aBrowser.execute((localAccessToken) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-recents');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-recents/bundle.js', () => {
        window.ciscospark.widget(csmmDom).on('all', (eventName) => {
          window.ciscoSparkEvents.push(eventName);
        });
      });
    }, accessToken);
  }
});
