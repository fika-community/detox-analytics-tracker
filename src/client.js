import fetch from 'node-fetch'
import buffer from './buffer'

class Client {
  #platform = 'ios'
  #options = {
    server: {
      ios: 'http://localhost:62556', // iOS simulator uses same network
      android: 'http://10.0.2.2:62556', // Android emulator loopback address
    },
  }
  #track = buffer(events => {
    return fetch(`${this.#options.server[this.#platform]}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(events),
    })
  }, 300)
  /**
   * Returns a object that will track any method invocations
   * @param name label of the proxy object
   * @param platform android or ios
   *
   * eg: getProxy('Analytics', 'ios').trackEvent('login_button_tap')
   */
  getProxy = (name, platform) => {
    this.#platform = platform
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return (...args) => {
            this.#track({ call: `${name}.${prop.toString()}`, args })
          }
        },
      }
    )
  }
}

export default new Client()
