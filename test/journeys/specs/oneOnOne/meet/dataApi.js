import recentTests from './base';

recentTests({
  name: 'Data API',
  browserSetup({aBrowser, accessToken, toPersonEmail}) {
    aBrowser
      .url('/data-api/space.html')
      .execute(() => {
        localStorage.clear();
      });

    aBrowser.execute((localAccessToken, localToUserEmail) => {
      const csmmDom = document.createElement('div');
      csmmDom.setAttribute('class', 'ciscospark-widget');
      csmmDom.setAttribute('data-toggle', 'ciscospark-space');
      csmmDom.setAttribute('data-access-token', localAccessToken);
      csmmDom.setAttribute('data-to-person-email', localToUserEmail);
      csmmDom.setAttribute('data-initial-activity', 'message');
      document.getElementById('ciscospark-widget').appendChild(csmmDom);
      window.loadBundle('/dist-space/bundle.js', () => {
        window.ciscospark.widget(csmmDom).on('all', (eventName, detail) => {
          window.ciscoSparkEvents.push({eventName, detail});
        });
      });
    }, accessToken, toPersonEmail);
  }
});
