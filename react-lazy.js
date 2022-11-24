"use strict";

var _react = _interopRequireWildcard(require("react"));

var _React = require("React");

var _createLazyVisibiltyComponents = _interopRequireDefault(require("./createLazyVisibiltyComponents"));

var _capacities = require("./capacities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function lazyVisiblity(load, opts, intersectionObserverOptions) {
  if (opts === void 0) {
    opts = {};
  }

  return (0, _createLazyVisibiltyComponents["default"])([load, opts], {
    Lazy: _React.lazy,
    LoadingComponent: opts.fallback ? function () {
      return opts.fallback;
    } : null,
    intersectionObserverOptions: intersectionObserverOptions
  });
}

module.exports = lazyVisiblity;