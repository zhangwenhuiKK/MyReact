import { TEXT_ELEMENT } from './common'

let preInstance = null
function render(element, parentDom){
    const newInstance = reconcile(element, preInstance, parentDom)
    preInstance = newInstance
}

function reconcile(newElement, preInstance, parentDom){
    //第一次渲染
    if(preInstance == null){
        const newInstance = instantiate(newElement)
        parentDom.appendChild(newInstance.dom)
        return newInstance
    //应该删除dom节点
    }else if(newElement == null){
        parentDom.removeChild(preInstance.dom)
        return null
    }else if(preInstance.element.type !== newElement.type){
        const newInstance = instantiate(newElement)
        parentDom.replaceChild(newInstance.dom, preInstance.dom);                                          // parentDom.replaceChild(preDom, newInstance.dom)
        return newInstance
    }else if(typeof newElement.type === 'string'){  
        //保留旧实例的dom节点，只更新其属性
        updateDomProperties(preInstance.dom, preInstance.element.props, newElement.props)
        //处理子实例，准备newChildInstances存放新的子实例们
        const newChildInstances = []
        const preChildInstances = preInstance.childInstances
        const newChildElements = newElement.props.children  
        const count = Math.max(preChildInstances.length, newChildElements.length)
        for(let i = 0; i < count; i++){
            const preChildInstance = preChildInstances[i]
            const newChildElement = newChildElements[i]
            const newChildInstance = reconcile(newChildElement, preChildInstance, preInstance.dom)
            newChildInstances.push(newChildInstance)
        }
        //更新childInstances
        preInstance.childInstances = newChildInstances.filter(instance => instance != null); 
        //更新element
        preInstance.element = newElement
        return preInstance
    }else{
       preInstance.element.props = newElement.props
       const preChildInstance = preInstance.childInstance
       const newChildElement = preInstance.wrapperInstance.render()
       const newChildInstance = reconcile(newChildElement, preChildInstance, parentDom)
       preInstance.childInstance = newChildInstance
       preInstance.dom = newChildInstance.dom
       return preInstance
    }
}

function instantiate(element){
    const { type, props} = element
    if(typeof type == 'string'){
        const isTextElement = type === TEXT_ELEMENT
        //创建节点
        const dom = isTextElement ? document.createTextNode(''): document.createElement(type)
        //更新属性和事件
        updateDomProperties(dom, [], props);
        //添加子实例
        const children = props.children 
        const childInstances = []
        children.forEach(child => {               
            const childInstance = instantiate(child)
            dom.appendChild(childInstance.dom)
            childInstances.push(childInstance)
        })
        //返回element对应的实例
        return { element, dom, childInstances }
    }else{
        const instance = {}
        const wrapperInstance = createWrapperInstance(element, instance)
        const childElement = wrapperInstance.render()
        const childInstance = instantiate(childElement)
        const dom = childInstance.dom
       // instance = { dom, element, childInstance, wrapperInstance }
       Object.assign(instance, { dom, element, childInstance, wrapperInstance })
       return instance
    }
    
}
function createWrapperInstance(element, instance){
    const { type, props } = element
    const wrapperInstance = new type(props)
    wrapperInstance.__internalInstance = instance
    return wrapperInstance
}
function updateDomProperties(dom, preProps, newProps){    
    const isListener = name => name.startsWith("on");
    const isAttribute = name => !isListener(name) && name != "children";
    //remove listeners
    Object.keys(preProps).filter(isListener).forEach(propName => {
        dom.removeEventListener(propName.substring(2).toLowerCase(), preProps[propName])
    })
    //remove attributes
    Object.keys(preProps).filter(isAttribute).forEach(propName => {
        //== dom.removeAttribute(propName)
        dom[propName] = null
    }) 
    //add listeners
    Object.keys(newProps).filter(isListener).forEach(propName => {
       //propName是一个字符串，不可以用newProps.propName获取
        dom.addEventListener(propName.toLowerCase().substring(2), newProps[propName])   
    })
    //add attributes
    Object.keys(newProps).filter(isAttribute).forEach(propName => {
        dom[propName] = newProps[propName]
    })
}
export  { render, reconcile}