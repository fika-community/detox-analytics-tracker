"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "client", {
  enumerable: true,
  get: function () {
    return _client.default;
  }
});
Object.defineProperty(exports, "server", {
  enumerable: true,
  get: function () {
    return _server.default;
  }
});
var _server = _interopRequireDefault(require("./server"));
var _client = _interopRequireDefault(require("./client"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }