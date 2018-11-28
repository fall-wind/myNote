# React-DOM

当前版本 16.6

本文省略 hydrate 以及 异步更新

# 第一次 render 过程

第一次 render 即一下代码的执行过程

```javascript
ReactDOM.render(document.getElementById('app'), <App />))
```

ReactDOM 对象：

```javascript
const ReactDOM = {
	render,
	createPortal,
	findDOMNode,
	// 其他属性
	...otherProps,
};
```

执行 render 方法 调用 legacyRenderSubtreeIntoContainer：

1. 通过`legacyCreateRootFromDOMContainer`创建一个 root
2. 如果 callback 是一个函数 则将 callback 绑定到 instance 上执行
3. 调用 `DOMRenderer.unbatchedUpdates` 以非批量更新的方式执行`root.render(children, callback)`；

## 创建 root

`legacyCreateRootFromDOMContainer`：

1. 如果当前的 container 存在子元素，则递归将子元素移除。

```javascript
let rootSibling;
while ((rootSibling = container.lastChild)) {
	container.removeChild(rootSibling);
}
```

2. 返回一个 root `new ReactRoot(container)`

使用 DOMRenderer.createContainer --> createFiberRoot --> 创建一个 fiberRoot

## 调用 root.render

`DOMRenderer.updateContainer(children, root, null, work._onCommit)`
即调用 DOMRenderer 的[updateContainer](./ReactFiberReconciler.md#updateContainer)；

计算出当前时间: 本机测试 1106（dev 环境）

和当前的到期时间： 1

再调用`updateContainerAtExpirationTime`

-   获取到当前的 context
-   调用`scheduleRootUpdate`

`scheduleRootUpdate` 根据`expirationTime`使用`createUpdate`创建一个更新；并将更新插入到当前 fiberRoot 的更新队列中；执行`scheduleWork`调度工作

调用 requestWork

调用`addRootToSchedule`将 root 加入到调度器中 将调度器中的 firstScheduledRoot lastScheduledRoot 设置为 root

当前版本默认不开启异步模式 所以下一步
调用`performSyncWork` --> `performWork(Sync, false)`

`performWork`:  
`findHighestPriorityRoot`找到最高优先级的根节点 当前为 root

```javascript
while (
	nextFlushedRoot !== null &&
	nextFlushedExpirationTime !== NoWork &&
	minExpirationTime <= nextFlushedExpirationTime
) {
	performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
	findHighestPriorityRoot();
}
```
由于当前只有这个root所以这个while循环在第一次执行的时候nextFlushedRoot就别置为null 循环中止

```javascript
function performWorkOnRoot(root, expirationTime) {
    isRendering = true
    const finishedWork = root.finishedWork
    if (finishWork !== null) {
        completeRoot(...args)
    } else {
        renderRoot(root)
        finishedWork = root.finishedWork
        if (finishWork !== null) {
            completeRoot(...args)
        }
    }
    isRendering = false
}
```

`performWorkOnRoot`：
进入操作时 先将isRendering置为true 调度器进入渲染阶段； 判断root上的finishedWork是否存在 如果存在则说明render阶段已经完成 进入`completeRoot`； 第一次渲染时则`renderRoot` 再去提交commit 最后将isRendering置为false

```javascript
function renderRoot() {
    isWorking = true
    // 第一次渲染 此时nextRoot === null nextUnitOfWork === null
    if (expirationTime !== nextRenderExpirationTime || root !== nextRoot || nextUnitOfWork === null) {
        nextRoot = root
        // This is used to create an alternate fiber to do work on.
        // 创建一个备用的fiber
        nextUtilOfWork = createWorkInProgress()
        root.pendingCommitExpirationTime = NoWork;
    }

    do {
        try {
            workLoop()
        } catch (erorr) {

        }
    } while (true)
}

```

`renderRoot`：
将isWorking置为true 

```javascript
// 忽略isYieldy 现在为false
// 这是一个while循环 当performUtilOfWork返回的nextUtilOfWork为null时终止
function workLoop() {
    if (!isYieldy) {
        while (nextUtilOfWork !== null) {
            nextUtilOfWork = performUnitOfWork(nextUtilOfWork)
        }
    }
}
```

`performUtilOfWork`: 

```javascript
function performUnitOfWork() {
    let next = beginWork(current, workInProgress, nextRenderExpirationTime);
    if (next === null) {
        next = completeUnitOfWork(workInProgress);
    }
    return next
}
```
在 workLoop的递归中 `beginWork`返回 `nextUnitWork` 如果next 为null 则进行complete的工作

```javascript
function completeUnitOfWork() {
    // 意图在完成当前工作之后移动到相邻节点，当是最后一个兄弟节点时，返回至父fiber
    while(true) {
        // 当前 flushed fiber的state都是备用的; 理想状态下，不需要依赖它；但当你依赖他的时候就说明
        // 我们不需要在过程中添加额外的field
        const current = workInProgress.alternate

        const returnFiber = workInProgress.return
        const sibling = workInProgress.sibling
        
        // 如果当前fiber没有被中断 即已经完成了
        if ((workInProgress.effectTag & Incomplete) === NoEffect) {
            nextUnitOfWork = completeWork(current, workInProgress, nextRenderEpirationTime)
            resetChildExpirationTime(workInProgress, nextRenderEpirationTime)

            if (
                returnFiber !== null &&
                // Do not append effects to parents if a sibling failed to complete
                (returnFiber.effectTag & Incomplete) === NoEffect
            ) {

            }
        } else {

        }
    }

    // ready to commit
    onComplete(root, rootWorkInProgress, expirationTime)
}
```

```javascript
// supportsMutation === true
// function updateHostComponent(
//     current: Fiber,
//     workInProgress: Fiber,
//     type: Type,
//     newProps: Props,
//     rootContainerInstance: Container,
// ) {

// }

function completeWork(
    current,
    workInProgress,

) {
    switch(workInProgress.tag) {
        case HostComponent: {
            const type = workInProgress.type
            if (current !== null && workInProgress.stateNode !== null) {
                updateHostComponent
            }
        }
        case ClassComponent: {

        }
    }
}
```
host component进行diff比较 effectTag |= Update


```javascript
function commitRoot() {
    prepareForCommit(root.containerInfo)
}

function completeRoot(root, finishedWork, expirationTime) {
    // ....
    commitRoot(root, finishedWork)

}
```

```javascript
function commitRoot() {
    prepareForCommit()
    // dom操作
    commitAllHostEffects()

    // 生命周期
    commitAllLifeCycles()
}
```

`commitRoot` --> `prepareForCommit` --> `commitAllHostEffects` --> `commitAllLifeCycles`


### ReactRoot

构造函数：

```javascript
function ReactRoot(container) {
	const root = DOMRenderer.createContainer(container);
	this._internalRoot = root;
}

ReactRoot.prototype.render = function(children, callback) {
	const root = this._internalRoot;
	const work = new ReactWork();
	callback = callback === undefined ? null : callback;
	if (callback !== null) {
		work.then(callback);
	}
	DOMRenderer.updateContainer(children, root, null, work._onCommit);
};
```

[ReactWork](#ReactWork)
[createContainer](./ReactFiberReconciler.md#createContainer)
[updateContainer](./ReactFiberReconciler.md#updateContainer)

### ReactWork

```javascript
function ReactWork() {
	this._callback = null;
	this._didCommit = false;

	this._onCommit = this._onCommit.bind(this);
}

ReactWork.prototype.then = function(onCommit) {
	if (this._didCommit) {
		onCommit();
		return;
	}
	let callbacks = this._callbacks;
	if (callbacks === null) {
		callbacks = this.callbacks = [];
	}
	callbacks.push(onCommit);
};

ReactWork.prototype._onCommit = function() {
	if (this._didCommit) {
		return;
	}
	this._didCommit = true;
	const callbacks = this._callbacks;
	if (callback === null) {
		return;
	}
	for (let i = 0; i < callbacks.length; i++) {
		const callback = callbacks[i];
		callback();
	}
};
```

作用： 创建一个`work`，通过`then`方法添加回调，`_onCommit`方法执行且只执行一次  后面调用  无效
