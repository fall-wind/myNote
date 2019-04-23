# 提要

代码的实现细节与其的特点是紧密相连的

- fiber结构
- 过期时间 任务优先级 过期时间的更新 
- 当前任务可以被更高优先级任务打断 以及被打断任务的复用
- 更新的创建 任务调度

# 流程概述

初始化渲染 setState 基本的流程

计算当前时间 计算过期时间 创建更新 将更新加入更新队列 调用调度器

# scheduleWork

1. 找到对应的 FiberRoot 节点
2. 找到符合条件重置 stack
3. 符合条件请求工作调度

## 找到对应的 FiberRoot 节点

## scheduleWorkToRoot：

根据提供的 expriationTime 从当前 fiber 向上遍历找到 rootFiber，并取出 stateNode 属性即为 fiberRoot；同时更新遍历节点和他的 alternate 节点的 childExpirationTime 时间：如果传入的到期时间优先级大于原先的 childExpirationTime 属性则更新 否则保留原值；最后返回 fiberRoot

## resetStack:

记录被打断的 fiber

## markPendingPriorityLevel：

设置 expirationTime

## requestWork：

如果当前正在 Batch 更新中且不再非 Batch 更新中 立即调度更新，如果此时在批量更新不再非批量更新中 则返回；此时的 requestWork 所做的就是将 root 添加到 schedulerRoot 上

## addRootToSchedule:

在调度器中 Roots 放置在一个链表上 由 firstScheduledRoot，lastScheduledRoot 组成的 通过 nextScheduledRoot 属性链接

## performWork
- 循环root条件
- 超过时间片处理

## findHighestPriorityRoot:

循环遍历 scheduledRoot 这个链表， 如果当前 root 的优先级为 NoWork 则将这个 root 从链中移除，移除逻辑如下：

如果当前 root === root.nextScheduledRoot 即当前链表中只有一项,则直接将 firstScheduledRoot lastScheduledRoot 此时的 root 置为 null 中断循环

当前的为链表的第一项
、、、、（省略删除逻辑）

然后循环找出到期时间最大的那个 root 将这个 root 和到期时间分别赋给 nextFlushedRoot、nextFlushedExpirationTime 结束函数。

## performWorkOnRoot:

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

结合 findHighestPriorityRoot 如果没有新任务进入到调度 这个递归调用完 scheduleRoot 这个链表将为空，对到期时间不为 NoWorK 的 root 调用 performWorkOnRoot

在函数执行前和结束分别 isRendering 标志位置为 true 和 false。

如果当前的 root 上有 finishedWork， 则说明这个 root 是一个已经完成但被更高优先级打断的 root，这时直接调用 completeRoot 去 commit 他

如没有给 root 添加一个为 null 的 finishWork 属性，调用 renderRoot；在 commit 他

## renderRoot：

将近三百多行的代码
在开始和结束的时候分别设置 isWorking 标志位为 true 和 false
对 ReactCurrentDispatcher.current 设置为 ContextOnlyDispatcher；这个是 Hooks 相关的代码；当 workLoop 工作结束之后 将 ReactCurrentDispatcher.current 再置回之前的值；这个是在 workLoop 期间不希望 Hooks 相关的代码运行

起步工作：设置 nextRoot、nextRenderExpirationTime、nextUnitOfWork  
如果堆栈是空的 或者我们重新开始上一个 yielded work

## workLoop

进入 workLoop 递归调用 performUnitOfWork 直到 nextUtilOfWork 为空

## performUnitOfWork

在 fiber 的双生 fiber alternate 节点上进行更新

调用 beginWork

如果 beginWork 返回的是一个 null 则说明没有工作要做 这时候一个 unitWork 就完成了 调用 completeUnitOfWork

## beginWork

对于 class 组件有这么一段代码

```javascript
if (childExpirationTime < renderExpirationTime) {
	// The children don't have any work either. We can skip them.
	// TODO: Once we add back resuming, we should check if the children are
	// a work-in-progress set. If so, we need to transfer their effects.
	return null;
} else {
	// This fiber doesn't have work, but its subtree does. Clone the child
	// fibers and continue.
	cloneChildFibers(current, workInProgress);
	return workInProgress.child;
}
```
我们从之前都是一直从fiberRoot节点操作的 这部分代码：
当当前的fiber节点上的过期时间的优先级比当前的渲染过期时间的话 说明当前子节点没有更新；则返回一个null
否则返回

## completeUnitOfWork

当前的更新都在 alternate 的 fiber 上 需要将


## completeWork

根据不同平台具有不同的操作

计算需要更新的内容

### hostComponent

current === null 这个判断是否第一次渲染

createInstance：创建一个dom实例
```javascript
if (type === 'script') {
    // Create the script via .innerHTML so its "parser-inserted" flag is
    // set to true and it does not execute
    const div = ownerDocument.createElement('div');
    div.innerHTML = '<script><' + '/script>'; // eslint-disable-line
    // This is guaranteed to yield a script element.
    const firstChild = ((div.firstChild: any): HTMLScriptElement);
    domElement = div.removeChild(firstChild);
} 
```

precacheFiberNode: 给dom节点上添加 fiber对象的引用

updateFiberProps 将props添加到dom上


appendAllChildren

1. 子节点上发现stateNode 将其挂载在instance上
2. 子节点的兄弟节点

append子节点 不会对遍历到嵌套结构


finalizeInitialChildren --> setInitialProperties

input: initWrapperState

挂载：initialChecked、initialValue、controlled

auto-foucs makeUpdate

### hostText

## updateHostComponent
更新Host Component

prepareUpdate --> diffProperties

updatePayload = []

1. 先遍历老的props 找到老的props有的属性 新的没有 就是一个删除老的props
2. 遍历新的props

renderRoot的错误捕获


## unwindWork

ShouldCapture 更改 DidCapture

一个组件报错 向上寻找可以处理错误的组件 子树报错 所有的父级都会走unwindWork逻辑


## commitWork

先将isWorking isCommitting两个为true；

time 设置：  
获取 当前 pendingCommitExpirationTime并保存下来 将root上的pendingCommitExpirationTime置为NoWork；  
获取expirationTime、childExpirationTime 取出最高级的事件赋给earliestRemainingTimeBeforeCommit

// TODO
markCommittedPriorityLevels


// The resulting list is the set that would belong to the root's parent, if
// it had one; that is, all the effects in the tree including the root.

如果自身有effect 将其加入到自身的effectList上：  
因为一个fiber的effectList只包含他的children，不包含他自己。如果root含有effect 将他添加到list的结尾。

### prepareForCommit
- 获取当前事件监听是否被允许
- selectionInformation 从一个被选中的textarea input或contentEdibled节点获取当前被选中的信息 
- 禁用事件系统

//TODO：为什么禁用事件系统

赋给全局变量 nextEffect = firstEffect

三个while循环：

- commitBeforeMutationLifecycles
- commitAllHostEffects
- commitAllLifeCycles

## commitBeforeMutationLifecycles

对全局变量nextEffect遍历 对effectTag包含Snapshot的调用 commitBeforeMutationLifeCycles

### commitBeforeMutationLifeCycles
对FunctionComponent、ForwardRef、SimpleMemoComponent调用commitHookEffectList 这属于hooks的内容

ClassComponent组件：  
调用 instance的 getSnapshotBeforeUpdate 得到之前的一个快照赋给 instance的__reactInternalSnapshotBeforeUpdate属性


其他类型的组件什么都不做

在这三个方法执行完 都重新给firstEffect赋值：

nextEffect = firstEffect


### commitAllHostEffects

- ContentReset: commitResetTextContent将节点上的nodeValue属性置为undefined
- 对于具有 Ref的 将其分离 即 将ref.current置为null

后面对于插入 更新 删除的分别进行操作：

#### 插入
commitPlacement:  

找到当前节点的hostParent

//TODO 获取详情：  
getHostSibling 获取到原生组件的兄弟节点

HostComponent或 HostText：  
如果获取到兄弟节点然后插入在这个兄弟之前。

如果 container.nodeType === COMMENT_NODE 则获取到container的parentNode 插入到container之前；否则则这插入到container上。

// TODO
根据条件： trapClickOnNonInteractiveElement

HostProtal节点：

#### 插入加更新

- 节点移动
- commitWork

#### 更新

commitWork：  

同样的分为与hooks相关的组件与HostComponent组件

// TODO
hooks组件调用 commitHookEffectList

HostComponent：

获取updateQueue的payload 再将updateQueue置为null  
如果updatePayload存在 则调用 commitUpdate，commit这个update：  
commitUpdate：

```javascript
function commitUpdate(
  domElement: Instance,
  updatePayload: Array<mixed>,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object,
): void {
  // Update the props handle so that we know which props are the ones with
  // with current event handlers.
  updateFiberProps(domElement, newProps);
  // Apply the diff to the DOM node.
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
}
```

- 更新节点上的 props属性
- updateProperties：  

#### 删除

commitDeletion： 

- 调用 unmountHostComponents
- detachFiber

unmountHostComponents：

向上查找当前fiber挂载的Host组件 调用移除操作；分别fiber 和rootFiber进行相应的移除操作

// TODO 服务端渲染

// TODO 收尾操作


总结：commitAllHostEffects主要做的是原生组件的 增 删 改的更新，其他的组件的对应操作所做的逻辑  

// TODO 维护对应的fiber？


resetAfterCommit： 还原刚才的

- restoreSelection 存储刚才获取的selection信息 将HostConfig内的selectionInformation置为null
- 将事件系统设置为上次存储在 eventsEnabled的内容 将eventsEnabled置为null

接着继续将 nextEffect = firstEffect 继续下面的遍历

### commitAllLifeCycles：
看样子是与生命周期相关的代码

如果当前的effectTag包含Update或Callback时：
调用commitLifeCycles

effectTag包含Ref commitAttachRef：

**commitLifeCycles**

同样的分为hooks组件（Function Component,Forward,SimpleMemoComponent）调用 commitHookEffectList

ClassComponent组件：如果 current为null 则说明是第一次渲染 则调用组件didMount生命周期方法 否则调用 didUpdate方法  didUpdate存入三个参数：prevProps,prevState, instance.__reactInternalSnapshotBeforeUpdate第三个参数是我们在 commitBeforeMutationLifeCycles阶段保存的快照
接着 commitUpdateQueue

**commitUpdateQueue**
有一段注释：

// If the finished render included captured updates, and there are still
// lower priority updates left over, we need to keep the captured updates
// in the queue so that they are rebased and not dropped once we process the
// queue again at the lower priority.

如果这个结束的render包含captured更新 表示包含更低优先级的更新没有处理，我们需要报captured更新保持在队列中
以至于他们任然保持以及；一旦我们在低优先级的时间内遍历这个更新队列他们不会丢失；

**commitUpdateEffects**
递归调用 effect的callback方法 然后将其置为null

**commitAttactRef**
获取到ref，如果ref存在：  
先获取到instanceToUse 如果是HostComponent则获取DOM组件，其他的则为fiber的stateNode属性  
然后根据ref的烈性调用 如果ref为Function 则ref(instanceToUse)， 其他ref.current = instanceToUse;

主要做生命周期和ref相关的工作

**commitPassiveEffects部分**
// TODO 分析这是什么  
三个循环调用玩继续向下 调用passiveEffectCallback

之后将isCommitting isWorking置为false 工作已经完成

### onCommitRoot
// TODO

### onCommit
- 设置root的下一个过期时间
- 将root上的finishWork置为null


再大概回顾到到这一步的过程：

scheduleRootUpdate --> schedulerWork --> scheduleWorkToRoot --> requestWork --> addRootToSchedule

上面是批量更新 异步更新同步更新的共同点

同步更新（接上方流程）：

performSyncWork --> performWork --> performWorkOnRoot --> renderRoot --> completeRoot

**renderRoot**详细：

renderRoot --> workLoop --> performUnitOfWork --> beginWork -> completeUnitOfWork --> completeWork --> onComplete

**completeRoot**
completeRoot --> commitRoot --> prepareForCommit --> commitBeforeMutationLifecycles --> commitAllHostEffects --> commitAllLifeCycles
--> onCommitRoot --> onCommit


## 实现细节

- expirationTime
- fiber节点创建 dom节点的创建
- effectTag设置与判断
- dom节点的更新


**getHostSibling**

获取一个before： 执行节点的插入操作 需要插入到那个之前

dom操作

设置兄弟节点的return

node.stateNode

1. 本身没有兄弟节点，向上查找父级的兄弟节点 知道找到 
2. 在向下查找到hostComponent

fiber树并不是所有的节点都有对应的dom树

如果插入是一个node tree

**updateDOMProperties**

遍历updatePayload属性（i + 2）

completeUnitOfWork commitWork commitUpdate


**commitDeletion**

- 遍历子树
- 卸载ref


protal 

node.child.return = node  
node = node.child

先找完一侧的子树 在返回遍历兄弟节点

*commitUnmount*

递归调用unmountHostComponents

递归调用遍历子树的每个元素 protalComponent特殊出来

**commitUpdateQueue**

是否有firstCapturedUpdate 异常出现并捕获
