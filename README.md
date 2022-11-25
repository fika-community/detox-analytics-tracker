# Detox analytics tracker

This library is intended to be used as a proxy server for analytics event when testing with detox.

# usage with detox

You probably have an object for sending analytics events to your analytics platfrom `analytics.js`. Create another file called `analytics.e2e.js` alongside it and make it be a `detox-analytics-tracker` proxy. This will be used as a swap in replacement by the react native bundler when running e2e tests.

analytics.js

```js
class Analytics {
  trackEvent = (eventName, eventParams) => {
    firebase.analytics().trackEvent(eventName, eventParams)
  }
}
```

analytics.e2e.js

```js
import { Platform } from 'react-native'
import client from 'detox-analytics-tracker/src/client'

export default client.getProxy('analytics', Platform.OS)
```

## configuring the react native bundler to use the proxy analytics object for e2e tests

Next we need to teach the metro bundler to prioritise tje `analytics.e2e.js` file over the `analytics.js` file when running tests. To do this we can update the `metro.config.js` to include a `resolver` to prioritise `.e2e.js` files based on a `RN_SRC_EXT` runtime environment variable in node. We can the pass the `RN_SRC_EXT` environment variable to the `react-native start` script at runtime in `package.json`

metro.config.js

```js
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts
module.exports = {
  transformer: { ... },
  /**
   * To prioritize any given source extension over the default one
   * @example
   *   RN_SRC_EXT=e2e.js npm start
   */
  resolver: {
    sourceExts: process.env.RN_SRC_EXT
                ? process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts)
                : defaultSourceExts
  },
};
```

package.json

```json
"scripts": {
    "start": "react-native start",
    "start-e2e": "RN_SRC_EXT=e2e.js npm run start",
}
```

## writing tests

```js
import { server } from 'detox-analytics-tracker'

describe('Login', () => {
  beforeAll(() => {
    server.start()
  })
  afterAll(() => {
    server.stop()
  })
  describe('given that a user logs in successfully', () => {
    beforeEach(async () => {
      await device.installApp()
      await device.launchApp({ newInstance: true })
    })
    afterEach(async () => {
      await device.uninstallApp()
      server.flush()
    })
    it('should track analytics events', async () => {
      const trackedEventNames = server.getEventsNames('analytics.trackEvent')
      expect(trackedEventNames).toEqual([
        'login_page_open',
        'login_page_submit_tap',
        'home_page_open',
      ])
      const trackedEvents = server.getEvents('analytics.trackEvent')
      expect(trackedEvents).toEqual([
        { eventName: 'login_page_open', params: {} },
        { eventName: 'login_page_submit_tap', params: { marketingOptin: true } },
        { eventName: 'login_page_open', params: { userId: 'abc123' } },
      ])
    })
  })
})
```
