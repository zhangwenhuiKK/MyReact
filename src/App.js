import MyReact from './myreact/index'      //为什么要导入这个“没用”的组件呢？      
const randomLikes = () => Math.ceil(Math.random() * 100);

const stories = [{ "likes": randomLikes() }];

function storyElement(story) {
      return (<li>{story.likes}</li>);
}

const addItem = () => { 
      stories.push({ "likes": randomLikes() })
      MyReact.render(createApp(), document.getElementById('root'))
}
const deleteItem = () => { 
    
}
const createApp = () => <div >
                              <p>some text</p>
                             <button onClick={e => addItem()}>add li</button>
                             <button onClick={e => deleteItem()}>delete li</button>
                            <ul>{stories.map(storyElement)}</ul>
                        </div>        
MyReact.render(createApp(), document.getElementById('root'))
