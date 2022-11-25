import connect from 'connect'
import http from 'http'
import bodyParser from 'body-parser'

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
      this.#recordEvent(req.body.call, req.body.arguments)
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
  flush = () => {
    this.#state.events = {}
    this.#state.eventNames = {}
  }
  getEvents = call => {
    return this.#state.events[call] || defaultEvents
  }
  getEventsNames = call => {
    return this.#state.eventNames[call] || defaultEventNames
  }
  stop = () => {
    if (!this.#state) {
      throw new Error('Server is already stopped')
    }
    this.#state.server.close()
    this.#state.server = undefined
    this.flush()
  }
}

export default new Server()
