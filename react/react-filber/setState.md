setState之后的更新流程
===
源码版本16.6.1

## Component组件
```javascript
// ReactBaseClasses.js
function Component(props, context) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.setState = function(partialState, callback) {
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

从这段代码可以看出，我们的Component组件在更新状态的时候调用的是`updater`(被称为渲染器)的`enqueueSetState`；接下来我们来看是如何注入的

## updater的注入

在`beginWork`阶段，class Component组件被构造的时被注入`updater`:  

`updateClassComponent` --> `constructClassInstance` --> `adoptClassInstance`

```javascript
// ReactFiberClassComponent.js
const classComponentUpdater = {
    isMounted,
    enqueueSetState,
    enqueueReplaceState,
    enqueueForceUpdate,
}

function adoptClassInstance(workInProgress, instance) {
    instance.updater = classComponentUpdater
}
```

## enqueueSetState
先直接上源码

```javascript
function getInstance(inst) {
    return inst._reactInternalFiber
}

// ReactFiberClassComponent.js
function enqueueSetState(inst, payload, callback) {
    const fiber = getInstance(inst)
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    const update = createUpdate(expirationTime);
    update.payload = payload;
    if (callback !== undefined && callback !== null) {
      update.callback = callback;
    }

    flushPassiveEffects();
    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
}

```
在你的组件内打印`this`发现有个`_reactInternalFiber`属性这就是当前的fiber （此处应有配图）

可以发现这些代码很熟悉：不就是初次渲染`updateContainer` --> `updateContainerAtExpirationTime` --> `scheduleRootUpdate`的过程吗？当然这其中还是有区别的。

简单描述一下这个过程：

- 根据传入的实例获取对应的fiber属性；
- 获取`currentTime`
- 根据`fiber`和`currentTime`获取`expirationTime`
- 根据`expirationTime`创建一个`update`，并将`setState`参数`payload`、`callback`挂在`update`上
- `flushPassiveEffects`
- 调用`enqueueUpdate`将`update`插入到`fiber`的`updateQueue`上
- 启动调度器`scheduleWork`
