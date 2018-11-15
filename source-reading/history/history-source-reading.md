history源码阅读
====

# createHashHistory

## history的使用

```javascript
import { createHashHistory } from 'history'

// 创建一个history对象
const history = createHashHistory()

const unlisten = history.listen((location, action) => {
    console.log(action, location)
})

history.push('/home', { params: 'state' })

```

1. 创建一个`history`对象
2. 注册`history`的监听， 监听location的变化，并返回了`unlisten`方法
3. 使用

## 创建一个`history`对象

```javascript
function createHashHistory(props = {}) {

    const history = {
        length: globalHistory.length,
        action: "POP",
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen
    };
    return history
}
```

`createHashHistory`方法返回了一个`history`对象，第一步是先进行监听，先看`listen`方法

```javascript
function listen(listener) {
    const unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return () => {
        checkDOMListeners(-1);
        unlisten();
    };
}
```

看看`transitionManager`对象是什么？

```javascript
const transitionManager = createTransitionManager();

function createTransitionManager() {
    let listeners = []

    // 监听
    function appendListener(fn) {
        let isActive = true;

        function listener(...args) {
            if (isActive) fn(...args);
        }

        listeners.push(listener);

        return () => {
            isActive = false;
            listeners = listeners.filter(item => item !== listener);
        };
    }

    return {
        setPrompt,
        confirmTransitionTo,
        appendListener,
        notifyListeners
    }
}
```

`createTransitionManager`创建一个`transitionManager`对象；先来看看这个对象`appendListener`方法：

与这个对象相关的一个内部变量（闭包缓存的）`listeners` 这是一个监听的数组，调用`appendListener`即将监听的`listeners`push进入到这个数组；同时返回一个unlisten 方法作为取消本次的监听  

isActive是`appendListener`内部的一个变量；从当前代码大概得知这个变量是确保在listener被移除之后，listener不被执行； 具体为什么要这么做，待会回头讲解

既然有监听 那么就有通知， 我们先来看看`transitionManager`的通知（`notifyListeners`）

```javascript
function notifyListeners(...args) {
    listeners.forEach(listener => listener(...args));
}
```

代码很容易理解 就是将listener内的listener遍历执行一遍


回过头来看`history`

```javascript
let listenerCount = 0;

function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1 && delta === 1) {
        window.addEventListener(HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
        window.removeEventListener(HashChangeEvent, handleHashChange);
    }
}

function listen(listener) {
    // 在transitionManager内注册一个监听
    const unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return () => {
        checkDOMListeners(-1);
        unlisten();
    };
}
```

`checkDOMListeners`作用是添加hashChange事件 和移除监听事件; 新增一个监听`checkDOMListeners(1)` 移除一个监听`checkDOMListeners(-1)`；`listenerCount`代表了当前添加的listener的个数

添加：当`listenerCount === 1 && delta === 1`防止重复添加`hashChange`的事件

移除：当 `listenerCount === 0`时 移除 hashChange事件

以上就是 history的创建与监听 下面来看看history的一些操作

## push replace
先上代码
```javascript
function createLocation(path, state, key, currentLocation) {

}

function setState() {
    //....
    transitionManager.notifyListeners(history.location, history.action)
}

function push(path, state) {
    const action = 'PUSH'
    const location = createLocation(path, undefined, undefined, history.location)

    transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok: () => {
            setState({ action, location });
        }
    )
}


function replace(path, state) {
    const action = 'REPLACE'
    const location = createLocation(..)
}


```

push与replace步骤相似：
`createLocation`根据参数生成一个自定义的`location`对象，我们先忽略细节；  
将参数传入`transitionManager.confirmTransitionTo`执行; setState执行了`transitionManager.notifyListeners`

```javascript
let prompt = null

function confirmTransitionTo(
    location,
    action,
    getUserConfirmation,
    callback
) {
    if (prompt != null) {
        const result = typeof prompt === "function" ? prompt(location, action) : prompt;
        if (typeof result === 'string') {

        }
    } else {
        callback(true)
    }
}
```

如果`prompt`为null 直接执行传入的`ok`函数 那我们来看看这个prompt是哪里来的

```javascript
// createTransitionManager.js
function setPrompt(nextPrompt) {
    prompt = nextPrompt;

    return () => {
        if (prompt === nextPrompt) prompt = null;
    };
}

// createHashHistory.js
let isBlocked = false;

function block(prompt = false) {
    const unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
        checkDOMListeners(1);
        isBlocked = true;
    }

    return () => {
        if (isBlocked) {
            isBlocked = false;
            checkDOMListeners(-1);
        }
        return unblock();
    }
}
```

`history.block`是history一个暴露出的API，作用是让路由更改（POP，PUSH，REPLACE）之前一个before函数，这个before函数的返回值决定路由是否更改。
`history.block`调用 `transitionManager.setPrompt`设置transitionManager内的prompt；并返回了一个清空方法，清除此次prompt的计数；

但这里的`isBlocked`变量意义何在尼？ 目的在添加监听hashChange事件，且确保所有的unblock只会注册一次事件（当然还有一个 setPrompt时的限制只能存在一个prompt 当你在注册第二个prompt时就会报错）
这时候有点疑问，hashChange事件不是被listen注册过了吗？原来是我想当然了，listen并不一定要和block同时使用 你可以只是使用block与其他的push pop replace等方法


使用：
```javascript
const unblock = history.block((location, action) => {
    if (someCondition) {
        return '是否确认离开？'
    }
})

if (condition) {
    unlisten()
}
```

默认是`window.confirm`你可以使用`getUserConfirmation`配置


## 其他方法

go goBack goForward调用的都是原生的go方法

本篇文章到此就结束了，还是建议大家自己去看源码