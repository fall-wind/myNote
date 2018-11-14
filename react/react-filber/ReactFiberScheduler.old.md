本文根据react的16.3的版本  其中有些部分是16.2。。。。。。

## scheduleWork
更新时间表
按照执行顺序
### scheduleWorkImpl
fun(fiber, expirationTime):void

scheduleWork做了什么？

首先记录```schedule```的更新

```
export function recordScheduleUpdate(): void {
  if (enableUserTimingAPI) {
    if (isCommitting) {
      hasScheduledUpdateInCurrentCommit = true;
    }
    if (
      currentPhase !== null &&
      currentPhase !== 'componentWillMount' &&
      currentPhase !== 'componentWillReceiveProps'
    ) {
      hasScheduledUpdateInCurrentPhase = true;
    }
  }
}
```


获取当前的fiber，父节点开始遍历
1. 更新到期时间
    1. 如果当前节点的到期时间等于NoWork或者优先级低于传入的expirationTime， 则更新为传入的expirationTime
    2. 更新alternate的到期时间，逻辑与“1”
2. 如果当前为根fiber(node.return === null)，且类型为HostRoot执行
    1. checkRootNeedsClearing
    2. requestWork
    3. checkRootNeedsClearing

当满足上述2的条件时的逻辑, 往下看：

```
if (
    !isWorking &&
    nextRenderExpirationTime !== NoWork &&
    expirationTime < nextRenderExpirationTime
) {
    // This is an interruption. (Used for performance tracking.)
    interruptedBy = fiber;
    resetStack();
}
```
当满足三个条件： 

- 不在isWorking状态
- 下次render的优先级不为 0
- 当前的执行优先级高于下次的执行优先级

当前的这次更新会造成中断， 此时将当前的fiber赋给interruptedBy；重置堆栈


```
function resetStack() {
    if (nextUnitOfWork !== null) {
        let interruptedWork = nextUnitOfWork.return;
        while (interruptedWork !== null) {
            unwindInterruptedWork(interruptedWork);
            // 找到interruptedWork的根fiber
            interruptedWork = interruptedWork.return;
        }
    }

    nextRoot = null;
    nextRenderExpirationTime = NoWork;
    nextUnitOfWork = null;

    isRootReadyForCommit = false;
}

// 名为不间断工作
// 这里的工作应该是与context相关
// TODO
function unwindInterruptedWork(work: Fiber) {
    switch(work.tag) {
        case ClassComponent: 
        case HostRoot: 
        case HostComponent: 
        // ......
    }
}
```

```
// If we're in the render phase, we don't need to schedule this root
// for an update, because we'll do it before we exit...
if (
    !isWorking ||
    isCommitting ||
    // ...unless this is a different root than the one we're rendering.
    nextRoot !== root
) {
    // Add this root to the root schedule.
    requestWork(root, expirationTime);
}
```

如果我们在render阶段 我们没有必要去```schedule```这个root作为更新，因为我们会在退出的时候做；除非是一个与我们正在render的root不同

满足以下一个条件即执行```requestWork```： 

- 不在working状态
- 在committing中
- nextRoot不等于root

### checkRootNeedsClearing(16.2)

```
function checkRootNeedsClearing(
    root: FiberRoot,
    fiber: Fiber,
    expirationTime: ExpirationTime,
) {
    if (
      !isWorking &&
      root === nextRoot &&
      expirationTime < nextRenderExpirationTime
    ) {
      // Restart the root from the top.
      if (nextUnitOfWork !== null) {
        // This is an interruption. (Used for performance tracking.)
        interruptedBy = fiber;
      }
      nextRoot = null;
      nextUnitOfWork = null;
      nextRenderExpirationTime = NoWork;
    }
}
```
在当前没有work进行时（!isWorking）、上次的root等于这次的root相同，则中断此次的work且当前优先级高于nextRenderExpirationTime；将相关的变量置为初始状态
### requestWork
每当schedule接收到update时，都调用requestWork；
在未来的某一时刻，renderer调用renderRoot会一起更新

首先调用```addRootToSchedule```

```
function addRootToSchedule(root: FiberRoot, expirationTime: ExpirationTime) {
    // Add the root to the schedule.
    // Check if this root is already part of the schedule.
    // 检查这个```root```是否已经是```schedule```的一部分。 
    if (root.nextScheduledRoot === null) {
        // This root is not already scheduled. Add it.
        // 设置 remainingExpirationTime时间
        root.remainingExpirationTime = expirationTime;
        // 并设置lastScheduledRoot 和root的nextScheduledRoot， 形成一个链表
        if (lastScheduledRoot === null) {
            firstScheduledRoot = lastScheduledRoot = root;
            root.nextScheduledRoot = root;
        } else {
            lastScheduledRoot.nextScheduledRoot = root;
            lastScheduledRoot = root;
            lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
        }
    } else {
        // This root is already scheduled, but its priority may have increased.
        // 如果这个root已经存在， 其优先级可能需要更新，更新到优先级高的部分
        const remainingExpirationTime = root.remainingExpirationTime;
        if (
            remainingExpirationTime === NoWork ||
            expirationTime < remainingExpirationTime
        ) {
        // Update the priority.
            root.remainingExpirationTime = expirationTime;
        }
    }
}
```

接着往下:

如果正在render， 则返回；

这是为了防止重入，剩余的工作将被安排在更新批次的最后

```
if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return;
}
```

isRendering这个标志位会在执行```performWorkOnRoot```的时候被置为```true```，在结束的时候被指为```false```

```
if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    if (isUnbatchingUpdates) {
        // ...unless we're inside unbatchedUpdates, in which case we should
        // flush it now.
        nextFlushedRoot = root;
        nextFlushedExpirationTime = Sync;
        performWorkOnRoot(root, Sync, false);
    }
    return;
}
```
// TODO 上述的这段逻辑待理解

接着
```
if (expirationTime === Sync) {
    performSyncWork();
} else {
    // 执行异步的
    scheduleCallbackWithExpiration(expirationTime);
}
```
根据expirationTime去执行同步或异步的工作；

### scheduleCallbackWithExpiration

```
function scheduleCallbackWithExpiration(expirationTime) {
    if (callbackExpirationTime !== NoWork) {
        // A callback is already scheduled. Check its expiration time (timeout).
        if (expirationTime > callbackExpirationTime) {
            // Existing callback has sufficient timeout. Exit.
            return;
        } else {
            // Existing callback has insufficient timeout. Cancel and schedule a
            // new one.
            cancelDeferredCallback(callbackID);
        }
        // The request callback timer is already running. Don't start a new one.
    } else {
        startRequestCallbackTimer();
    }

    // Compute a timeout for the given expiration time.
    const currentMs = now() - originalStartTimeMs;
    const expirationMs = expirationTimeToMs(expirationTime);
    const timeout = expirationMs - currentMs;

    callbackExpirationTime = expirationTime;
    callbackID = scheduleDeferredCallback(performAsyncWork, {timeout});
}
```

有关callbackExpirationTime这个变量在performWork满足```deadline !== null```情况下会被重置为```NoWork```  


### performWork
- 设置root的nextScheduledRoot、remainingExpirationTime
- 设置firstScheduledRoot，lastScheduledRoot
将lastScheduledRoot和firstScheduledRoot置为

首先执行[findHighestPriorityRoot](#findHighestPriorityRoot)

然后根据```isAsync```来进行操作

如果是异步的操作
```
while (
    nextFlushedRoot !== null &&
    nextFlushedExpirationTime !== NoWork &&
    (minExpirationTime === NoWork ||
        minExpirationTime >= nextFlushedExpirationTime) &&
    (!deadlineDidExpire ||
        recalculateCurrentTime() >= nextFlushedExpirationTime)
) {
    performWorkOnRoot(
        nextFlushedRoot,
        nextFlushedExpirationTime,
        !deadlineDidExpire,
    );
    findHighestPriorityRoot();
}
```

如果是同步：

```
while (
    nextFlushedRoot !== null &&
    nextFlushedExpirationTime !== NoWork &&
    (minExpirationTime === NoWork ||
        minExpirationTime >= nextFlushedExpirationTime)
) {
    performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, false);
    findHighestPriorityRoot();
}
```

可以看出与异步的区别在于调用```performWorkOnRoot```传入的第三个参数；

<!-- 这是一个递归schedule root链表的过程 直到 -->

#### performWorkOnRoot

执行renderRoot和completeRoot

renderRoot

#### [findHighestPriorityRoot](#findHighestPriorityRoot)

// 找到最高权限的Root

这个方法最终set```nextFlushedRoot, nextFlushedExpirationTime```

这里有一段很长的逻辑，先找到```highestPriorityWork,highestPriorityRoot```的值：

存在一个schedule root的链表，  
遍历这个链表，如果当前项的剩余工作优先级为NoWork将其从schedule中移除

移除的逻辑： 

如果当前的链表内只有一个root，将root的nextScheduledRoot置为null，同时将firstScheduledRoot，lastScheduledRoot都置为null  

如果是第一个元素，获取root的nextScheduledRoot为next，next置给firstScheduledRoot，并将lastScheduledRoot的nextScheduledRoot置为next；再将root.nextScheduledRoot = null;  

如果是最后一个元素，将lastScheduledRoot置为previousScheduledRoot（为什么是previousScheduledRoot？以为previousScheduledRoot被！==Nowork的分支内被置为了当前元素，但对这次遍历来说，就是当前的pervious）；将lastScheduledRoot的nextScheduledRoot置为firstScheduledRoot（？？？？？）  
再将root.nextScheduledRoot = null;

如果不符合上述的情况，就是链表的中间项；

最后将root置为 previousScheduledRoot的nextScheduledRoot

如果当前项的remainingExpirationTime不为NoWork；那就走另一条逻辑;设置highestPriorityRoot，highestPriorityWork

```
if (lastScheduledRoot !== null) {
    let previousScheduledRoot = lastScheduledRoot;
    let root = firstScheduledRoot;
    while (root !== null) {
        const remainingExpirationTime = root.remainingExpirationTime;
        if (remainingExpirationTime === NoWork) {
            // This root no longer has work. Remove it from the scheduler.

            // TODO: This check is redudant, but Flow is confused by the branch
            // below where we set lastScheduledRoot to null, even though we break
            // from the loop right after.
            invariant(
                previousScheduledRoot !== null && lastScheduledRoot !== null,
                'Should have a previous and last root. This error is likely ' +
                    'caused by a bug in React. Please file an issue.',
            );
            if (root === root.nextScheduledRoot) {
                // This is the only root in the list.
                root.nextScheduledRoot = null;
                firstScheduledRoot = lastScheduledRoot = null;
                break;
            } else if (root === firstScheduledRoot) {
                // This is the first root in the list.
                // 这是个环形链表。。。。。
                const next = root.nextScheduledRoot;
                firstScheduledRoot = next;
                lastScheduledRoot.nextScheduledRoot = next;
                root.nextScheduledRoot = null;
            } else if (root === lastScheduledRoot) {
                // This is the last root in the list.
                lastScheduledRoot = previousScheduledRoot;
                lastScheduledRoot.nextScheduledRoot = firstScheduledRoot;
                root.nextScheduledRoot = null;
                break;
            } else {
                previousScheduledRoot.nextScheduledRoot = root.nextScheduledRoot;
                root.nextScheduledRoot = null;
            }
            root = previousScheduledRoot.nextScheduledRoot;
        } else {
            if (
                highestPriorityWork === NoWork ||
                remainingExpirationTime < highestPriorityWork
            ) {
                // Update the priority, if it's higher
                highestPriorityWork = remainingExpirationTime;
                highestPriorityRoot = root;
            }
            if (root === lastScheduledRoot) {
                break;
            }
            previousScheduledRoot = root;
            root = root.nextScheduledRoot;
        }
    }
}
const previousFlushedRoot = nextFlushedRoot;
if (
    previousFlushedRoot !== null &&
    previousFlushedRoot === highestPriorityRoot &&
    highestPriorityWork === Sync
) {
    nestedUpdateCount++;
} else {
    // Reset whenever we switch roots.
    nestedUpdateCount = 0;
}
nextFlushedRoot = highestPriorityRoot;
nextFlushedRoot = highestPriorityWork;
```

总结一下findHighestPriorityRoot所做的就是两件事 

- 找到schedule链表中的最高的优先级以及对应的root，并将它们分别赋值给nextFlushedRoot，nextFlushedRoot
- 清理remainingExpriationTime为NoWork的root

#### recalculateCurrentTime

当前时间减去originalStartTimeMs时间的毫秒数



### perfromWorkOnRoot

### findHighestPriorityRoot

```
nextFlushedRoot = highestPriorityRoot;
nextFlushedExpirationTime = highestPriorityWork;
```
### renderRoot

### createWorkInProgress

### workLoop

### performUnitOfWork

### beginWork

### completeRoot

### commitRoot

## msToExpirationTime

### 闭包变量理解
```
export const NoWork = 0;
export const Sync = 1;
export const Never = 2147483647; // Max int32: Math.pow(2, 31) - 1

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2;
```

- isWorking:<code>commitRoot</code> <code>renderRoot</code>
- AsyncUpdates
- isCommitting:<code>commitRoot</code>
- expirationContext:代表即将到来更新的优先级 相关的操作<code>deferredUpdates</code> <code>syncUpdates</code>
- nextUnitOfWork:<code>renderRoot</code>
- nextRoot:<code>renderRoot</code>
- nextRenderExpirationTime:<code>renderRoot</code>
- mostRecentCurrentTime <code>recalculateCurrentTime</code>
- interruptedBy
- isRendering：<code>performWorkOnRoot</code>
- isBatchingUpdates: <code>batchedUpdates</code>
- unbatchedUpdates: <code>unbatchedUpdates</code>

#### ScheduleRoot相关

- lastScheduledRoot
- firstScheduleRoot

roots是一个链表