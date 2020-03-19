'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createElement = require('./createElement');

var _createElement2 = _interopRequireDefault(_createElement);

var _render = require('./render');

var _render2 = _interopRequireDefault(_render);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MyReact = {
    createElement: _createElement2.default,
    render: _render2.default,
    Component: _component2.default
};
exports.default = MyReact;