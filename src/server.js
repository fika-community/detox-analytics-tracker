import connect from 'connect'
import http from 'http'
import bodyParser from 'body-parser'

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms))
const defaultEvents = []
const defaultEventNames = []
class Server {
  #defaultOptions = {
    port: 62556,
  }
  #state = {
    server: undefined,
    events: {},
    eventNames: {},
  }
  start = (startOptions = {}) => {
    if (this.#state.server) {
      throw new Error('Server is already started')
    }
    const options = { ...this.#defaultOptions, ...startOptions }
    const app = connect()
    app.use(bodyParser.json())
    app.use('/track', (req, res) => {
      for (const event of req.body) {
        this.#recordEvent(event.call, event.args)
      }
      res.end()
    })
    const server = http.createServer(app)
    server.listen(options.port)
    this.#state.server = server
  }
  #recordEvent = (call, args) => {
    const [eventName, params] = args
    if (!this.#state.events[call]) {
      this.#state.events[call] = []
    }
    if (!this.#state.eventNames[call]) {
      this.#state.eventNames[call] = []
    }
    this.#state.events[call].push({ eventName, params })
    this.#state.eventNames[call].push(eventName)
  }
  flush = async () => {
    await sleep(1000) // sleep so that all incoming events are caught up before flushing
    this.#state.events = {}
    this.#state.eventNames = {}
  }
  getEvents = call => {
    return this.#state.events[call] || defaultEvents
  }
  getEventsNames = call => {
    return this.#state.eventNames[call] || defaultEventNames
  }
  stop = async () => {
    if (!this.#state.server) {
      throw new Error('Server is already stopped')
    }
    this.#state.server?.close()
    this.#state.server = undefined
    await this.flush()
  }
}

export default new Server()
