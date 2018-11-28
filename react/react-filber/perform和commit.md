# 触发事件时

debugger的调用堆栈：

- dispatchInteractiveEvent
- interactiveUpdates
- interactiveUpdates
- performSyncWork
- performWork
- performWorkOnRoot
- completeRoot
- commitRoot


## 两个阶段与生命周期

两个阶段把生命周期化为两个部分

```
// 第1阶段 render/reconciliation
componentWillMount
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate

// 第2阶段 commit
componentDidMount
componentDidUpdate
componentWillUnmount
```

第一个阶段可能被更高优先级的work所打断，也就意味着第一阶段的生命周期可能被执行多次