import fetch from 'node-fetch'

const DEFAULT_OPTIONS = {
  server: {
    ios: 'http://localhost:62556', // iOS simulator uses same network
    android: 'http://10.0.2.2:62556', // Android emulator loopback address
  },
}

class Client {
  #options = DEFAULT_OPTIONS
  configure = (configOptions = {}) => {
    options = { ...DEFAULT_OPTIONS, ...configOptions }
  }
  #track = (platform, name, args = {}) => {
    return fetch(`${this.#options.server[platform]}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call: name,
        arguments: args,
      }),
    })
  }
  /**
   * Returns a object that will track any method invocations
   * @param name label of the proxy object
   * @param platform android or ios
   *
   * eg: getProxy('Analytics', 'ios').trackEvent('login_button_tap')
   */
  getProxy = (name, platform) => {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          return (...args) => {
            return this.#track(platform, `${name}.${prop.toString()}`, args)
          }
        },
      }
    )
  }
}

export default new Client()
