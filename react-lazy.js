"use strict";

var _react = _interopRequireDefault(require("react"));

var _React = require("React");

var _createLazyVisibiltyComponents = _interopRequireDefault(require("./createLazyVisibiltyComponents"));

var _capacities = require("./capacities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function createLazy(load, fallback) {
  var LazyComponent = (0, _React.lazy)(load);

  function ComponentLazy(props) {
    return /*#__PURE__*/_react["default"].createElement(_React.Suspense, {
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