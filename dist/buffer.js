"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// creates an inside out promise allowing the caller to resolve or reject it at a time of their choosing
function defer() {
  let resolve,
    reject,
    isComplete = false;
  let promise = new Promise((promiseResolve, promiseReject) => {
    resolve = (...args) => {
      isComplete = true;
      promiseResolve(...args);
    };
    reject = (...args) => {
      isComplete = true;
      promiseReject(...args);
    };
  });
  return {
    isComplete,
    resolve,
    reject,
    promise
  };
}

// creates a function which gets called with an accumulation of all the calls made to it withing a period of time ()`wait`)
function buffer(func, wait) {
  let timeout;
  let actions = [];
  let deferred = defer();
  return action => {
    actions = [...actions, action];
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      deferred.resolve(func(actions));
      actions = [];
      deferred = defer();
    }, wait);
    return deferred.promise;
  };
}
var _default = buffer;
exports.default = _default;