# scheduleWork

scheduleWork --> requestWork --> performWork

版本 16.6

```javascript
function scheduleWork(fiber, expirationTime) {
    const root = scheduleWorkToRoot(fiber, expirationTime)
    if (root === null) {
        return
    }

    if (!isWorking && nextRenderExpirationTime !== NoWork && expirationTime < nextRenderExpirationTime) {
        interruptedBy = fiber
        resetStack()
    }

    // 修改root的 两个时间
    markPendingPriorityLevel(root, expirationTime)
    if (
        !isWorking ||
        isCommitting ||
        // 除非这是一个和我们正在渲染不一样的root
        nextRoot !== root
    ) {
        const rootExpirationTime = root.expirationTime
        requestWork(root, rootExpirationTime)
    }
}
```

## scheduleWorkToRoot

```javascript
// 第一次渲染expirationTime === NoWork 且初始化的root fiber的expirationTime === NoWork
// 返回fiber.stateNode

// 值越大则优先级越低
function scheduleWorkToRoot(fiber, expirationTime) {
    if (fiber.expirationTime === NoWork || fiber.expirationTime > expirationTime) {
        fiber.expirationTime = expirationTime
    }
    let alternate = fiber.alternate

    if (alternate !== null) {

    }

    // 

    let node = fiber.return
    let root = null
    // 第一次渲染 node === null
    if (node === null && fiber.tag === HostRoot) {
        root = fiber.stateNode
    }

    // if (enableSchedulerTracing) {
    //     const interactions = __interactionsRef.current
    // }

    return root

}
```

## markPendingPriorityLevel

```javascript
function markPendingPriorityLevel(root, expirationTime) {
    // 
    root.didError = false

    // 更新最晚和最早pending times
    const earliestPendingTime = root.earliestPendingTime
    if (earliestPendingTime === NoWork) {
        root.earliestPendingTime = root.latestPendingTime = expirationTime
    }
}
```

## requestCurrentTime
调度器调用requestCurrentTime来计算 `expirationTime`

`ExpirationTime` 是根据当前时间（开始时间）计算而来；如果当前一个事件出发了两个更新，即使这两个更新调用的真实物理时间不一样 我们也会把它开始时间视为相同

换句话说 因为`ExpirationTime`决定了如何处理批量更新， 我们希望一个事件触发所有更新都拥有想用的`ExpirationTime`

我们同时追踪两个独立的时间： 当前的‘renderer’时间和当前‘scheduler’时间 渲染时间可以随时被更新，它存在的意义在于优化`performance.now`的调用

只有在 没有正在进行的`work`或不处于没有事件执行的 条件下 我们才能更新`ExpirationTime`

```javascript
function requestCurrentTime() {
    if (isRendering) {
        return currentScheduleTime
    }
    // 检查当前是否有进行中的work
    findHighestPriorityRoot()

    if (nextFlushedExpirationTime === NoWork ||
        nextFlushedExpirationTime === Never
    ) {
        // 如果当前没有正在进行的work 或者当前的工作是在可见范围之外的，我们可以在没有混乱的风险下获取current time
        recomputeCurrentRendererTime();
        currentSchedulerTime = currentRendererTime;
        return currentSchedulerTime;
    }
    // 已经有等待进行的工作， 你可能在浏览器的事件中 如果我们获取当前时间 可能因为在相同的事件中接收到不同的`expirationtime` 引起多次更新 导致混乱 返回最后读到的时间。 时间会在下一次的idle回调中被更新
    return currentSchedulerTime
}
```
## findHighestPriorityRoot
第一次渲染返回NoWork

```javascript
function findHighestPriorityRoot() {
    let highestPriorityWork = NoWork;
    let highestPriorityRoot = null;
    if (lastScheduledRoot !== null) {
        // ..
        let previousScheduleRoot = lastScheduleRoot
        let root = firstScheduleRoot

        while (root !== null) {
            const remainingExpirationTime = root.expirationTime // 第一次渲染 同步下为 1
            if (remainingExpirationTime === NoWork) {
                // 这个root 没有work 将它从scheduler中移除

                if (root === root.nextScheduleRoot) {
                    // 只有一条root在列表中
                    root.nextScheduledRoot = null;
                    firstScheduledRoot = lastScheduledRoot = null;
                }
            } else {
                if (
                    highestPriorityWork === NoWork ||
                    remainingExpirationTime < highestPriorityWork
                ) {
                    // Update the priority, if it's higher
                    highestPriorityWork = remainingExpirationTime;
                    highestPriorityRoot = root;
                }

                // 只有一个root root === lastScheduledRoot === nextScheduledRoot
                if (root === lastScheduledRoot) {
                    break
                }

            }
        }
    }
    nextFlushedRoot = highestPriorityRoot;
    nextFlushedExpirationTime = highestPriorityWork;
}
```
## recomputeCurrentRendererTime
返回一个 毫秒数 / 10 + 2
2 为偏移量

```javascript
let originalStartTimeMs = now()

function recomputeCurrentRendererTime() {
    const currentTimeMs = now() - originalStartTimeMs; // 
    currentRendererTime = msToExpirationTime(currentTimeMs);
}

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2;

// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
}
```

## computeExpirationForFiber

```javascript
function computeExpirationForFiber(currentTime, fiber) {
    let expirationTime
    if (expirationContext !== NoWork) {
        expirationTime = expirationContext
    } else if (isWorking) {
        if (isCommitting) {
            // 发生在commit阶段的更新 默认的是异步优先级
            expirationTime = Sync
        } else {
            // 发生在render阶段的更新 和正在rendered work过期在相同的时间
            expirationTime = nextRenderExpirationTime;
        }
    } else {
        // 没有显示的expiration context被设置 且没有work被执行， 计算新的过期时间
        // 默认不开启异步模式 fiber.mode = 0 ;fiber.mode & ConcurrentMode = 0
        if (fiber.mode & ConcurrentMode) {
            if (isBatchInteractiveUpdates) {
                // currentTime 2 - 100 ?
                expirationTime = computeInteractiveExpiration(currentTime);
            } else {
                expirationTime = computeAsyncExpiration(currentTime);
            }
            if (nextRoot !== null && expirationTime === nextRenderExpirationTime) {
                expirationTime += 1
            }
        } else {
            // 同步模式
            expirationTime = Sync
        }
    }

    if (isBatchInteractiveUpdates) {
        // 交互更新 保持跟踪最低等级正在进行的交互过期时间； 这允许我们在需要的时候 同步一次更新所有的交互更新
        if (expirationTime > lowestPriorityPendingInteractiveExpirationTime) {
            lowestPriorityPendingInteractiveExpirationTime = expirationTime
        }
    }
}


// 上线 precesion * 1
function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}

function computeExpirationBucket(
  currentTime,
  expirationInMs,
  bucketSizeMs,
): ExpirationTime {
  return (
    MAGIC_NUMBER_OFFSET +
    ceiling(
      currentTime - MAGIC_NUMBER_OFFSET + expirationInMs / UNIT_SIZE,
      bucketSizeMs / UNIT_SIZE,
    )
  );
}

export const HIGH_PRIORITY_EXPIRATION = __DEV__ ? 500 : 150;
export const HIGH_PRIORITY_BATCH_SIZE = 100;

export function computeInteractiveExpiration(currentTime: ExpirationTime) {
  return computeExpirationBucket(
    currentTime,
    HIGH_PRIORITY_EXPIRATION,
    HIGH_PRIORITY_BATCH_SIZE,
  );
}

// computeExpirationBucket(3, 500, 100) = 2 + ceiling(3- 2 + 50, 10) = 2 + (50 / 10 + 1) * 10
```

## requestWork
无论何时root接受到一个更新requestWork都会被调用，有渲染器在未来某个时间调用renderRoot
```javascript
function requestWork(root, expirationTime) {
    // 第一次渲染 将全局变量 nextScheduleRoot lastScheduleRoot置为 root
    addRootToSchedule(root, expirationTime)

    if (isRendering) {
        // 组织多次进入 剩下的工作将被安排在当前rendering批处理的结尾
        return
    }
    if (isBatchingUpdates) {

    }

    if (expirationTime === Sync) {
        performSyncWork()
    }
}
```

## addRootToSchedule

```javascript
function addRootToSchedule(root, expirationTime) {
    // 将root添加到调度器中
    // 检查root是否也已经在调度器中了
    if (root.nextScheduledRoot === null) {
        // 
        root.expirationTime = expirationTime
        if (lastScheduleRoot === null) {
            firstScheduleRoot = lastScheduleRoot = root
            root.nextScheduledRoot = next
        } else {
            // ...
        }
    }
}
```

## performSyncWork
```javascript
function performSyncWork() {
    performWork(Sync, null)
}
```

## performWork
```javascript
function performWork(minExpirationTime, dl) {
    deadline = dl;
    // 保持working在roots上直到没有更多的工作或者我们到达deadline
    
    findHighestPriorityRoot()
    if (deadline !== null) {
        // ...
    } else {
        while (
            nextFlushedRoot !== null &&
            nextFlushedExpirationTime !== NoWork &&
            (minExpirationTime === NoWork ||
            minExpirationTime >= nextFlushedExpirationTime)
        ) {
            performWorkOnRoot(nextFlushedRoot, nextFlushedExpirationTime, true)
            findHighestPriorityRoot()
        }
    }

}
```

## performWorkOnRoot
```javascript
function performWorkOnRoot(root, expirationTime, isExpired) {
    isRendering = true

    // check是否异步work或者 sync/expired work
    if (deadline === null || isExpired) {
        // 

        let finishedWork = root.finishedWork
        if (finishedWork !== null) {
            completeRoot(root, finishWork, expirationTime)
        } else {
            root.finishWork = null
            // 如果这个root之前被暂停了 清理它存在的timeout，直到我们即将再次尝试
            // ....

            const isYieldy = false
            // 
            renderRoot(root, isYieldy, isExpired)
        }
    }
}
```

## renderRoot
```javascript
function renderRoot(root, isYieldy, isExpired) {
    isWorking = true
    ReactCurrentOwner.currentDispatcher = Dispatcher

    const expirationTime = root.nextExpirationTimeToWorkOn

    // check 我们是开始一个全新的堆栈 还是重用之前产生的工作
    if (
        expirationTime !== nextRenderExpirationTime ||
        root !== nextRoot ||
        nextUnitOfWork === null
    ) {
        // Reset stack and start working from the root
        resetStack()

        nextRoot = root
        nextRenderExpirationTime = expirationTime
        nextUnitOfWork = createWorkInProgress(
            nextRoot.current,
            null,
            nextRenderExpirationTime,
        )
    }

    do {
        try {
            workLoop(isYieldy)
        } catch(thrownValue) {

        }
    } while (true)
}
```

## workLoop

```javascript
// 第一次为false
function workLoop(isYieldy) {
    if (!isYieldy) {
        while (nextUtilOfWork != null) {
            nextUtilOfWork = performUnitOfWork(nextUtilOfWork)
        }
    }
}

function performUnitOfWork(workInprogress) {
    const current = workInProgress.alternate;

    let next
    if (enableProfilerTimer) {

    } else {
        next = beginWork(current, workInProgress, nextRenderExpirationTime);
        workInProgress.memoizedProps = workInProgress.pendingProps;
    }
}
```

[beginWork](./ReactFiberBeginWork#ReactFiberBeginWork)


## schedule的全局变量

### expirationContext
代表下一次更新使用的的expiration time。如果是NoWork则是用默认的策略： 同步更新使用同步模式 异步使用异步模式
