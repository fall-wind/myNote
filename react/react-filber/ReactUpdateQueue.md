# 更新队列

## update 和 updateQueue类型

以一个 update 为基本单位, 一个 update 对象为：

```javascript
// Update对象
export type Update<State> = {
	expirationTime: ExpirationTime,

	tag: 0 | 1 | 2 | 3,
	payload: any,
	callback: (() => mixed) | null,

	next: Update<State> | null,
	nextEffect: Update<State> | null,
};

// UpdateQueue对象
export type UpdateQueue<State> = {
	baseState: State,

	firstUpdate: Update<State> | null,
	lastUpdate: Update<State> | null,

	firstCapturedUpdate: Update<State> | null,
	lastCapturedUpdate: Update<State> | null,

	firstEffect: Update<State> | null,
	lastEffect: Update<State> | null,

	firstCapturedEffect: Update<State> | null,
	lastCapturedEffect: Update<State> | null,
};
```

## createUpdate

```javascript
function createUpdate(expirationTime) {
    return {
        expirationTime,

        tag: UpdateState,
        payload: null,
        callback: null,

        next: null,
        nextEffect: null,
    }
}
```

## createUpdateQueue

```javascript
function createUpdateQueue(baseState) {
    return {
        baseState,
        firstUpdate,
        lastUpdate,
        firstCapturedUpdate,
        lastCapturedUpdate,
        firstEffect,
        lastEffect,
        firstCapturedEffect,
        lastCapturedEffect,
    }
}
```

## enqueueUpdate
enqueueUpdate 代码比较长

```javascript
function enqueueUpdate(fiber, update) {
    const alternate = fiber.alternate
    let queue1;
    let queue2;
    if (alternate === null) {
        // 只有一个fiber
        queue1 = fiber.updateQueue
        queue2 = null
        if (queue1 === null) {
            queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState)
        }
    } else {

    }

    // 第一次render
    if (queue2 === null || queue1 === queue2) {
        appendUpdateToQueue(queue1, update)
    }

}
```

## enqueueUpdateToQueue
将更新插入到更新队列中

```javascript
function enqueueUpdate(queue, update) {
    if (queue.lastUpdate === null) {
        queue.firstUpdate = queue.lastUpdate = update
    } else {
        queue.lastUpdate.next = update
        queue.lastUpdate = update
    }

}
```

