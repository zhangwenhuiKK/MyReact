"use strict";

var _index = require("./myreact/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//为什么要导入这个“没用”的组件呢？      
var randomLikes = function randomLikes() {
  return Math.ceil(Math.random() * 100);
};

var stories = [{
  name: "Didact introduction",
  url: "http://bit.ly/2pX7HNn",
  likes: randomLikes()
}];

function storyElement(story) {
  return _index2.default.createElement(
    "li",
    null,
    _index2.default.createElement(
      "button",
      { onClick: function onClick(e) {
          return handleClick(story);
        } },
      story.likes,
      _index2.default.createElement("b", null)
    ),
    _index2.default.createElement(
      "a",
      { href: story.url },
      story.name
    )
  );
}

var handleClick = function handleClick(story) {
  story.likes++;
  _index2.default.render(createApp(), document.getElementById('root'));
};
var createApp = function createApp() {
  return _index2.default.createElement(
    "ul",
    null,
    stories.map(storyElement)
  );
}; //jsx不能有嵌套的{}
_index2.default.render(createApp(), document.getElementById('root'));