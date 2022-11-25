"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _loadableComponents = _interopRequireDefault(require("./loadable-components.js"));

var _reactLazy = _interopRequireDefault(require("./react-lazy.js"));

exports.lazy = _reactLazy["default"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _loadableComponents["default"];
exports["default"] = _default;