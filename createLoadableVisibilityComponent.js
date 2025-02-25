"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _capacities = require("./capacities");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var trackedElements = new Map();
var visibleElements = new Map();
var options = {
  threshold: 0,
  rootMargin: "0px 0px 100% 0px"
};

function createIntersectionObserver(intersectionObserverOptions) {
  if (_capacities.IntersectionObserver) {
    return new window.IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        var visibilityHandler = trackedElements.get(entry.target);

        if (visibilityHandler && (entry.isIntersecting || entry.intersectionRatio > 0)) {
          visibilityHandler();
        }
      });
    }, intersectionObserverOptions);
  }
} // create an intersection observer with the default options


var intersectionObserver = createIntersectionObserver(options);

function createLoadableVisibilityComponent(args, _ref) {
  var _args$;

  var Loadable = _ref.Loadable,
      preloadFunc = _ref.preloadFunc,
      loadFunc = _ref.loadFunc,
      LoadingComponent = _ref.LoadingComponent,
      intersectionObserverOptions = _ref.intersectionObserverOptions;

  // if options have been passed to the intersection observer a new instance of intersection observer is created using these passed options else the same instance of intersectin observer will observe all the target elements.
  if (typeof intersectionObserverOptions === "object") {
    intersectionObserver = createIntersectionObserver(intersectionObserverOptions);
  }

  var preloaded = false,
      loaded = false;
  var visibilityHandlers = [];
  var LoadableComponent = Loadable.apply(void 0, args);
  var componentName = args == null ? void 0 : (_args$ = args[0]) == null ? void 0 : _args$.chunkName();

  function LoadableVisibilityComponent(props) {
    var _args$2;

    var visibilityElementRef = (0, _react.useRef)();

    var _useState = (0, _react.useState)(preloaded),
        isVisible = _useState[0],
        setVisible = _useState[1];

    function visibilityHandler() {
      if (visibilityElementRef.current) {
        intersectionObserver.unobserve(visibilityElementRef.current);
        trackedElements["delete"](visibilityElementRef.current);
        visibleElements.set(componentName, true);
      }

      setVisible(true);
    }

    (0, _react.useEffect)(function () {
      var element = visibilityElementRef.current;

      if (!isVisible && element) {
        visibilityHandlers.push(visibilityHandler);
        trackedElements.set(element, visibilityHandler);
        intersectionObserver.observe(element);
        return function () {
          var handlerIndex = visibilityHandlers.indexOf(visibilityHandler);

          if (handlerIndex >= 0) {
            visibilityHandlers.splice(handlerIndex, 1);
          }

          intersectionObserver.unobserve(element);
          trackedElements["delete"](element);
        };
      }
    }, [isVisible, visibilityElementRef.current]);

    if (isVisible || args != null && (_args$2 = args[1]) != null && _args$2.ssr || visibleElements.get(componentName)) {
      return /*#__PURE__*/_react["default"].createElement(LoadableComponent, props);
    }

    if (LoadingComponent || props.fallback) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        ref: visibilityElementRef,
        "data-testid": props == null ? void 0 : props.dataTestId
      }, props.fallback ? props.fallback : /*#__PURE__*/_react["default"].createElement(LoadingComponent, _extends({
        isLoading: true
      }, props)));
    }

    return /*#__PURE__*/_react["default"].createElement("div", {
      ref: visibilityElementRef,
      "data-testid": props == null ? void 0 : props.dataTestId
    });
  }

  LoadableVisibilityComponent[preloadFunc] = function () {
    if (!preloaded) {
      preloaded = true;
      visibilityHandlers.forEach(function (handler) {
        return handler();
      });
    }

    return LoadableComponent[preloadFunc]();
  };

  LoadableVisibilityComponent[loadFunc] = function () {
    if (!loaded) {
      loaded = true;
      visibilityHandlers.forEach(function (handler) {
        return handler();
      });
    }

    return LoadableComponent[loadFunc]();
  };

  return LoadableVisibilityComponent;
}

var _default = createLoadableVisibilityComponent;
exports["default"] = _default;