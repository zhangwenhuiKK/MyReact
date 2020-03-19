'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _common = require('./common');

var preInstance = null;
function render(element, parentDom) {
    var newInstance = reconcile(element, preInstance, parentDom);
    preInstance = newInstance;
}

function reconcile(newElement, preInstance, parentDom) {
    //第一次渲染
    if (preInstance === null) {
        var newInstance = instantiate(newElement);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
        //应该删除dom节点
    } else if (newElement === null) {
        parentDom.removeChild(preInstance.dom);
        return null;
    } else if (preInstance.element.type === newElement.type) {
        //保留旧实例的dom节点，只更新其属性
        updateDomProperties(preInstance.dom, preInstance.element.props, newElement.props);
        //处理子实例，准备newChildInstances存放新的子实例们
        var newChildInstances = [];
        var preChildInstances = preInstance.childInstances;
        var newChildElements = newElement.props.children || [];
        var count = Math.max(preChildInstances.length, newChildElements.length);
        for (var i = 0; i < count; i++) {
            var preChildInstance = preChildInstances[i];
            var newChildElement = newChildElements[i];
            var newChildInstance = reconcile(newChildElement, preChildInstance, preInstance.dom);
            newChildInstances.push(newChildInstance);
        }
        //更新childInstances
        preInstance.childInstances = newChildInstances.filter(function (instance) {
            return instance != null;
        }); //???
        //更新element
        preInstance.element = newElement;
        return preInstance;
    } else {
        var _newInstance = instantiate(newElement);
        parentDom.replaceChild(_newInstance.dom, preInstance.dom); // parentDom.replaceChild(preDom, newInstance.dom)
        return _newInstance;
    }
}

//{element, dom, childInstances}
function instantiate(element) {
    var type = element.type,
        props = element.props;

    var isTextElement = type === _common.TEXT_ELEMENT;
    //创建节点
    var dom = isTextElement ? document.createTextNode('') : document.createElement(type);
    updateDomProperties(dom, [], props);
    var children = props.children || []; //注意element.props.children可能为undefined
    var childInstances = [];
    children.forEach(function (child) {
        //需要用map吗？
        var childInstance = instantiate(child);
        dom.appendChild(childInstance.dom);
        childInstances.push(childInstance);
    });

    return { element: element, dom: dom, childInstances: childInstances };
}
function updateDomProperties(dom, preProps, newProps) {
    var isListener = function isListener(name) {
        return name.startsWith("on");
    };
    var isAttribute = function isAttribute(name) {
        return !isListener(name) && name != "children";
    };
    //remove listeners
    Object.keys(preProps).filter(isListener).forEach(function (propName) {
        dom.removeEventListener(propName.substring(2).toLowerCase(), preProps[propName]);
    });
    //remove attributes
    Object.keys(preProps).filter(isAttribute).forEach(function (propName) {
        //== dom.removeAttribute(propName)
        dom[propName] = null;
    });
    //add listeners
    Object.keys(newProps).filter(isListener).forEach(function (propName) {
        //propName是一个字符串，不可以用newProps.propName获取
        dom.addEventListener(propName.toLowerCase().substring(2), newProps[propName]);
    });
    //add attributes
    Object.keys(newProps).filter(isAttribute).forEach(function (propName) {
        dom[propName] = newProps[propName];
    });
}
exports.default = render;