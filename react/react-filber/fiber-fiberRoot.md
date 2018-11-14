
# ReactFiber

```javascript
Fiber {
    type: Function|string,
    key: null,
    elementType: ,
    type: any // The resolved function/class/ associated with this fiber.

    stateNode: any // // The local state associated with this fiber.
    return: Fiber,   // parent

    ref: any,
    pendingProps: Object,
    memoizedProps: Object,

    updateQueue: any,
    memoizedState: any,
    
    firstContextDependency: any,
    mode: any,

    effectTag: any,
    nextEffect: any,
    firstEffect: any,
    lastEffect: any,
    expirationTime: any,
    childExpirationTime: any,
    alternate: Fiber,
    
    actualDuration: any,
    actualStartTime: any,
    selfBaseDuration: any,
}

// 构造函数

function FiberNode() {
    // ....
}
```


## createFiber

```javascript
const createFiber = function(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
): Fiber {
  // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
  return new FiberNode(tag, pendingProps, key, mode);
};
```

## createHostRootFiber

```javascript
function createHostRootFiber(isConcurrent: boolean): Fiber {
  let mode = isConcurrent ? ConcurrentMode | StrictMode : NoContext;

  if (enableProfilerTimer && isDevToolsPresent) {
    // Always collect profile timings when DevTools are present.
    // This enables DevTools to start capturing timing at any point–
    // Without some nodes in the tree having empty base times.
    mode |= ProfileMode;
  }

  return createFiber(HostRoot, null, null, mode);
}
```

# ReactFiberRoot

```javascript
export type FiberRoot = {
  // Any additional information from the host associated with this root.
  containerInfo: any,
  // Used only by persistent updates.
  pendingChildren: any,
  // The currently active root fiber. This is the mutable root of the tree.
  current: Fiber,
  pendingCommitExpirationTime: ExpirationTime,
  // A finished work-in-progress HostRoot that's ready to be committed.
  finishedWork: Fiber | null,
  // Top context object, used by renderSubtreeIntoContainer
  context: Object | null,
  pendingContext: Object | null,
  +hydrate: boolean,
  // 剩余到期时间
  // TODO: Lift this into the renderer
  remainingExpirationTime: ExpirationTime,
  // TODO: Lift this into the renderer
  // 最高等级的批次列表，这个列表指一个commit是否应该被推迟 还包含完成回调
  firstBatch: Batch | null,
  // 根链表
  nextScheduledRoot: FiberRoot | null,
};
```

## createFiberRoot

创建一个FiberRoot

```javascript
function createFiberRoot(containerInfo, isConcurrent) {
    const uninitializedFiber = createHostRootFiber(isConcurrent)
    const root = {
        // ...props
    }
    uninitializedFiber.stateNode = root
    return root
}
```
