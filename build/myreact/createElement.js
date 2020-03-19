'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require('./common');

//生成element，每个element必符合{type, props}的数据结构
function createElement(type, config) {
  var _ref;

  var props = Object.assign({}, config); //props要复制给另一个对象

  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var hasChildren = args.length > 0;
  var rawChildren = hasChildren ? (_ref = []).concat.apply(_ref, args) : [];
  props.children = rawChildren.filter(function (child) {
    return child != null && child !== false;
  })
  //错误——> .map(child => typeof child !== "string" ? child :createTextElement(child)) 
  .map(function (child) {
    return child instanceof Object ? child : createTextElement(child);
  });
  return { type: type, props: props };
}
//规范文本节点的数据结构，若为文本节点，返回值如{type:'TEXT_ELEMENT', props: {nodeValue: 'hello world', children:[]}}
function createTextElement(text) {
  return createElement(_common.TEXT_ELEMENT, { nodeValue: text });
}
exports.default = createElement;