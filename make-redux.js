
/*
 * 动手实现 Redux
 * 参考：http://huziketang.com/books/react/lesson30
 *
 */


/**
 * 版本一：appState是全局的，在reanderApp()进行渲染时不能保证appState被篡改
 *
 */
/*const appState = {
    title: {
        text: 'React.js 小书',
        color: 'red',
    },
    content: {
        text: 'React.js 小书内容',
        color: 'blue'
    }
};

function reanderApp(appState) {
    ReanderTitle(appState.title);
    ReanderContent(appState.content);
}

function  ReanderTitle(title) {
    const  titleDom = document.getElementById('title');
    titleDom.innerHTML = title.text;
    titleDom.style.color = title.color;
}
function  ReanderContent(content) {
    const  contentDom = document.getElementById('content');
    contentDom.innerHTML = content.text;
    contentDom.style.color = content.color;
}
reanderApp(appState);*/





/**
 * 版本二：在版本一的基础上加上dispatch函数限制
 * 在reanderApp()进行渲染时appState必须通过dispatch函数限制改写，
 * 其他type默认default操作。
 *
 */
/*

const appState = {
    title: {
        text: 'React.js 小书',
        color: 'red',
    },
    content: {
        text: 'React.js 小书内容',
        color: 'blue'
    }
};

// action2种数据，一种数据的修改类型，一种修改的数据内容
function dispatch(action) {
    switch (action.type) {
        case 'UPDATE_TITLE_TEXT':
            appState.title.text = action.text;
            break;
        case 'UPDATE_TITLE_COLOR':
            appState.title.color = action.color;
            break;
        default:
            break;
    }
}

function reanderApp(appState) {
    ReanderTitle(appState.title);
    ReanderContent(appState.content);
}

function  ReanderTitle(title) {
    const  titleDom = document.getElementById('title');
    titleDom.innerHTML = title.text;
    titleDom.style.color = title.color;
}
function  ReanderContent(content) {
    const  contentDom = document.getElementById('content');
    contentDom.innerHTML = content.text;
    contentDom.style.color = content.color;
}

dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }) // 修改标题文本
dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }) // 修改标题颜色
reanderApp(appState);

*/


/**
 * 版本三：把数据的定义和数据的操作提取出来，放在一起。
 * 其他的操作如数据的渲染自己写。
 *
 */

/*//在createStore里面定义一个getState()和dispatch(),
//createStore的参数是原始数据和怎么改变数据的函数（具体操作）。
//dispatch封装各种数据操作。
function createStore (state,stateChanger) {
    const listeners =[]; //定义监听函数数组
    const subscribe = (listener) => listeners.push(listener); //定义一个加事件的函数
    const getState = () => state;
    const dispatch = (action) => {
        stateChanger(state, action);
        //每次数据更新时自动调用所有监听事件
        listeners.forEach((listener) =>listener());
    };
    return {getState,dispatch,subscribe};
}

//定义好初始数据
const appState = {
    title: {
        text: 'React.js 小书',
        color: 'red',
    },
    content: {
        text: 'React.js 小书内容',
        color: 'blue'
    }
};
//定义好对数据的操作
function stateChanger(state,action) {
    switch (action.type) {
        case 'UPDATE_TITLE_TEXT':
            state.title.text = action.text;
            break;
        case 'UPDATE_TITLE_COLOR':
            state.title.color = action.color;
            break;
        default:
            break;
    }
}

function reanderApp(appState) {
    ReanderTitle(appState.title);
    ReanderContent(appState.content);
    console.log('render app...')
}

function  ReanderTitle(title) {
    const  titleDom = document.getElementById('title');
    titleDom.innerHTML = title.text;
    titleDom.style.color = title.color;
    console.log('render title...')
}
function  ReanderContent(content) {
    const  contentDom = document.getElementById('content');
    contentDom.innerHTML = content.text;
    contentDom.style.color = content.color;
    console.log('render content...')
}

const store = createStore(appState,stateChanger);  //此时已经有了初始数据
store.subscribe(()=>reanderApp(store.getState())); //添加数据监听事件（包括渲染事件）
reanderApp(store.getState()); // 首次渲染页面
//对数据的修改
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }); // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }); // 修改标题颜色
*/


/**
 * 版本四：版本三每次更新数据都会重新渲染（包括传入的旧数据，本来是不应该渲染的。）
 * 渲染前旧数据和新数据比较，数据没有改变不渲染。
 */
/*

function createStore (state,stateChanger) {
    const listeners =[]; //定义监听函数数组
    const subscribe = (listener) => listeners.push(listener); //定义一个加事件的函数
    const getState = () => state;
    const dispatch = (action) => {
        state = stateChanger(state, action);  //覆盖原来的数据
        //每次数据更新时自动调用所有监听事件
        listeners.forEach((listener) =>listener());
    };
    return {getState,dispatch,subscribe};
}

//定义好初始数据
let appState = {
    title: {
        text: 'React.js 小书',
        color: 'red',
    },
    content: {
        text: 'React.js 小书内容',
        color: 'blue'
    }
}
//定义好对数据的操作
//此时的state应该变为oldstate,上一次的旧数据，而不是每次比较的时候都是一直不变的初始数据
function stateChanger (state, action) {
    //如果有修改就返回一个新对象，没有修改就返回旧对象
    switch (action.type) {
        case 'UPDATE_TITLE_TEXT':
            //不直接修改原来的数据
            //返回一个对象，已state对象为基础，覆盖（改写）里面的title数据
            return { // 构建新的对象并且返回
                ...state,
                title: {
                    ...state.title,
                    text: action.text
                }
            }
        case 'UPDATE_TITLE_COLOR':
            return { // 构建新的对象并且返回
                ...state,
                title: {
                    ...state.title,
                    color: action.color
                }
            }
        default:
            return state // 没有修改，返回原来的对象
    }
}
//渲染函数渲染应该新旧state数据对比
//新state从stateChanger函数获取，渲染函数执行完后将state变为旧数据。
//第一次旧state是从store.getState()开始
function reanderApp(newAppState,oldAppState ={}) {
    //如果整体对象没有变化就退出
    if(newAppState === oldAppState) return;
    ReanderTitle(newAppState.title,oldAppState.title);
    ReanderContent(newAppState.content,oldAppState.content);
    console.log('render app...')
}
//改写渲染函数，每次渲染前先和旧数据比较下，如果相同不渲染。
//oldTitle首次渲染时是空对象。
function  ReanderTitle(newTitle,oldTitle={}) {
    if(newTitle === oldTitle) return;
    const  titleDom = document.getElementById('title');
    titleDom.innerHTML = newTitle.text;
    titleDom.style.color = newTitle.color;
    console.log('render title...')
}
function  ReanderContent(newContent, oldContent = {}) {
    if(newContent === oldContent) return;
    const contentDom = document.getElementById('content');
    contentDom.innerHTML = newContent.text;
    contentDom.style.color = newContent.color;
    console.log('render content...')
}

const store = createStore(appState,stateChanger);  //此时已经有了初始数据
let oldState = store.getState();  //缓存获取没渲染前的旧数据，以后旧数据可被改写
store.subscribe(()=>{
    //获取最新的数据并渲染
    const newState = store.getState();
    reanderApp(newState,oldState);
    oldState = newState;
    //渲染后将数据保存为旧数据
}); //添加数据监听事件（包括渲染事件）

reanderApp(store.getState()); // 首次渲染页面
//对数据的修改
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }); // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }); // 修改标题颜色


*/


/**
 * 版本五：将appState数据放在stateChanger里面初始化。
 * 如果stateChanger有变化就返回新对象,没有变化返回上一次变化的对象。
 * action:应用中的各类动作或操作，不同的操作会改变应用相应的state状态，说白了就是一个带type属性的对象。
 * store:是我们储存state的地方。我们通过redux当中的createStore方法来创建一个store，它提供3个主要的方法
 */

function createStore (reducer) {
    //state改成函数里面的局部变量
    let state = null;
    const listeners =[]; //定义监听函数数组
    const subscribe = (listener) => listeners.push(listener); //定义一个加事件的函数
    const getState = () => state;
    const dispatch = (action) => {
        state = reducer(state, action);  //覆盖原来的数据
        //每次数据更新时自动调用所有监听事件
        listeners.forEach((listener) =>listener());
    };
    dispatch({});  //（会调用stateChanger函数进行state初始化）
    return {getState,dispatch,subscribe};
    undefined
}

//重写stateChanger（改名为reducer）方法，state在里面定义和重写
function reducer(state, action) {
    //在stateChanger方法获取state数据，之前是在全局环境下初始化的
    //一开始是没有state数据的，就创建一个state数据。
    if(!state){
        return{
            title: {
                text: 'React.js 小书',
                color: 'red',
            },
            content: {
                text: 'React.js 小书内容',
                color: 'blue'
            }
        }
    }

    switch (action.type) {
        case 'UPDATE_TITLE_TEXT':
            return {
                ...state,
                title: {
                    ...state.title,
                    text: action.text
                }
            }
        case 'UPDATE_TITLE_COLOR':
            return {
                ...state,
                title: {
                    ...state.title,
                    color: action.color
                }
            }
        default:
            return state // 没有修改，返回原来的对象
    }
}

function reanderApp(newAppState,oldAppState ={}) {
    //如果整体对象没有变化就退出
    if(newAppState === oldAppState) return;
    ReanderTitle(newAppState.title,oldAppState.title);
    ReanderContent(newAppState.content,oldAppState.content);
    console.log('render app...')
}

function  ReanderTitle(newTitle,oldTitle={}) {
    if(newTitle === oldTitle) return;
    const  titleDom = document.getElementById('title');
    titleDom.innerHTML = newTitle.text;
    titleDom.style.color = newTitle.color;
    console.log('render title...')
}
function  ReanderContent(newContent, oldContent = {}) {
    if(newContent === oldContent) return;
    const contentDom = document.getElementById('content');
    contentDom.innerHTML = newContent.text;
    contentDom.style.color = newContent.color;
    console.log('render content...')
}

const store = createStore(reducer);
let oldState = store.getState();
store.subscribe(()=>{
    const newState = store.getState();
    reanderApp(newState,oldState);
    oldState = newState;
});

reanderApp(store.getState()); // 首次渲染页面
store.dispatch({ type: 'UPDATE_TITLE_TEXT', text: '《React.js 小书》' }); // 修改标题文本
store.dispatch({ type: 'UPDATE_TITLE_COLOR', color: 'blue' }); // 修改标题颜色











































