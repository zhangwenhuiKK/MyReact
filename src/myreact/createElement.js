 import {TEXT_ELEMENT} from './common'
//生成element，每个element必符合{type, props}的数据结构
function createElement(type, config, ...args){
    const props = Object.assign({}, config);               //props要复制给另一个对象
    const hasChildren = args.length > 0
    const rawChildren = hasChildren ? [].concat(...args) : [];
    props.children = rawChildren
                  .filter(child => child != null && child !== false)
                  //错误——> .map(child => typeof child !== "string" ? child :createTextElement(child)),child可能为number类型 
                  .map(child => child instanceof Object? child :createTextElement(child))  
    return {type, props};
}
//规范文本节点的数据结构，若为文本节点，返回值如{type:'TEXT_ELEMENT', props: {nodeValue: 'hello world', children:[]}}
function createTextElement(text){
  return createElement(TEXT_ELEMENT,{ nodeValue: text })
 }
 export default createElement
