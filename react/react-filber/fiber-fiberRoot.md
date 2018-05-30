
## ReactFiber

```
Fiber {
    type: Function|string,
    key: null,
    child: Fiber,    // first child
    sibling: Fiber,  // first sibling
    return: Fiber,   // parent
    pendingProps: Object,
    memoizedProps: Object,
    pendingWorkPriority: Number,
    alternate: Fiber,
    output: Object
}
```

通过child，sibling，return遍历

## ReactFiberRoot

```
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

## fiber树的遍历

