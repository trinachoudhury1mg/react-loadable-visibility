"use strict";

var _react = _interopRequireWildcard(require("react"));

var _component = _interopRequireDefault(require("@loadable/component"));

var _createLoadableVisibilityComponent = _interopRequireDefault(require("./createLoadableVisibilityComponent"));

var _capacities = require("./capacities");

var _createLoadableServerComponent = _interopRequireDefault(require("./createLoadableServerComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function loadableVisiblity(load, opts, intersectionObserverOptions) {
  if (opts === void 0) {
    opts = {};
  }

  if (_capacities.IntersectionObserver) {
    return (0, _createLoadableVisibilityComponent["default"])([load, opts], {
      Loadable: _component["default"],
      preloadFunc: "preload",
      loadFunc: "load",
      LoadingComponent: opts.fallback ? function () {
        return opts.fallback;
      } : null,
      intersectionObserverOptions: intersectionObserverOptions
    });
  } else {
    var _opts, _opts2;

    var newOpts = _extends({}, opts, {
      fallback: (_opts = opts) != null && _opts.fallback ? /*#__PURE__*/_react["default"].createElement("div", null, (_opts2 = opts) == null ? void 0 : _opts2.fallback) : /*#__PURE__*/_react["default"].createElement("div", null)
    });

    return (0, _createLoadableServerComponent["default"])(load, newOpts);
  }
}

module.exports = loadableVisiblity;