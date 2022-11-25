"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _connect = _interopRequireDefault(require("connect"));
var _http = _interopRequireDefault(require("http"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const defaultEvents = [];
const defaultEventNames = [];
class Server {
  #defaultOptions = {
    port: 62556
  };
  #state = {
    server: undefined,
    events: {},
    eventNames: {}
  };
  start = (startOptions = {}) => {
    if (this.#state.server) {
      throw new Error('Server is already started');
    }
    const options = {
      ...this.#defaultOptions,
      ...startOptions
    };
    const app = (0, _connect.default)();
    app.use(_bodyParser.default.json());
    app.use('/track', (req, res) => {
      for (const event of req.body) {
        this.#recordEvent(event.call, event.args);
      }
      res.end();
    });
    const server = _http.default.createServer(app);
    server.listen(options.port);
    this.#state.server = server;
  };
  #recordEvent = (call, args) => {
    const [eventName, params] = args;
    if (!this.#state.events[call]) {
      this.#state.events[call] = [];
    }
    if (!this.#state.eventNames[call]) {
      this.#state.eventNames[call] = [];
    }
    this.#state.events[call].push({
      eventName,
      params
    });
    this.#state.eventNames[call].push(eventName);
  };
  flush = () => {
    this.#state.events = {};
    this.#state.eventNames = {};
  };
  getEvents = call => {
    return this.#state.events[call] || defaultEvents;
  };
  getEventsNames = call => {
    return this.#state.eventNames[call] || defaultEventNames;
  };
  stop = () => {
    if (!this.#state) {
      throw new Error('Server is already stopped');
    }
    this.#state.server.close();
    this.#state.server = undefined;
    this.flush();
  };
}
var _default = new Server();
exports.default = _default;