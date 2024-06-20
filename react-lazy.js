"use strict";

var _react = _interopRequireWildcard(require("react"));

var _createLazyVisibiltyComponents = _interopRequireDefault(require("./createLazyVisibiltyComponents"));

var _capacities = require("./capacities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function createLazy(load, fallback) {
  var LazyComponent = /*#__PURE__*/(0, _react.lazy)(load);

  function ComponentLazy(props) {
    return /*#__PURE__*/_react["default"].createElement(_react.Suspense, {
      fallback: /*#__PURE__*/_react["default"].createElement("div", null, "fallback")
    }, /*#__PURE__*/_react["default"].createElement(LazyComponent, props));
  }

  return ComponentLazy;
}

function lazyVisiblity(load, opts, intersectionObserverOptions) {
  if (opts === void 0) {
    opts = {};
  }

  if (_capacities.IntersectionObserver) {
    var _opts, _opts2, _createLazyVisibiltyC;

    return (0, _createLazyVisibiltyComponents["default"])(load, (_createLazyVisibiltyC = {
      fallback: opts.fallback
    }, _createLazyVisibiltyC["fallback"] = (_opts = opts) != null && _opts.fallback ? /*#__PURE__*/_react["default"].createElement("div", null, (_opts2 = opts) == null ? void 0 : _opts2.fallback) : /*#__PURE__*/_react["default"].createElement("div", null), _createLazyVisibiltyC.intersectionObserverOptions = intersectionObserverOptions, _createLazyVisibiltyC));
  } else {
    return createLazy(load, opts.fallback);
  }
}

module.exports = lazyVisiblity;