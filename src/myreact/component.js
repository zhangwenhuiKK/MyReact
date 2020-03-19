import { reconcile } from './render'
class Component{
     constructor(props){
        this.props = props
        this.state = this.state || {}
     }
     setState(partitalState){
        this.state = Object.assign({}, this.state, partitalState)
        updateInstance(this.__internalInstance)
     }
 }
//由于组件状态改变触发的组件更新
 function updateInstance(internalInstance){
    const element = internalInstance.element
    const parentDom = internalInstance.dom.parentNode
    reconcile(element, internalInstance, parentDom)
 }
 export default Component