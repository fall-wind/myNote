# ReactFiberReconciler

即 ReactDOM 引用的 DOMRenderer 对象

DOMRenderer 一些方法分析：

## createContainer
```javascript
function createContainer(
  containerInfo,
  isConcurrent,
  hydrate,
) {
  return createFiberRoot(containerInfo, isConcurrent, hydrate);
}
```

[createFiberRoot](./fiber-fiberRoot.md)

## getPublicRootInstance

## updateContainer

```javascript
function updateContainer(element, container, parentComponent, callback) {
    const current = container.current; // 一个fiber类型
    // 获取当前时间
    const currentTime = requestCurrentTime();
    // 根据当前时间和fiber得到expiration time
    // 同步模式为 1
    const expirationTime = computeExpirationForFiber(currentTime, current);
    
	return updateContainerAtExpirationTime(
		element,
		container,
		parentComponent,
		expirationTime,
		callback,
	);
}
```

## updateContainerAtExpirationTime

```javascript
function updateContainerAtExpirationTime(
	element,
	container,
	parentComponent,
	expirationTime,
	callback,
) {
	// TODO: If this is a nested container, this won't be the root.
	const current = container.current;

	const context = getContextForSubtree(parentComponent);
	if (container.context === null) {
		container.context = context;
	} else {
		container.pendingContext = context;
	}

	return scheduleRootUpdate(current, element, expirationTime, callback);
}

function getContextForSubtree(parentComponent) {
    // 第一次渲染返回一个空Context对象
    if (!parentComponent) {
        return emptyContextObject
    }

}
```

`scheduleRootUpdate`

```javascript
function scheduleRootUpdate(current, element, expirationTime, callback) {
    const update = createUpdate(current)
    update.payload = {element};

    callback = callback === undefined ? null : callback;
    if (callback !== null) {
        update.callback = callback
    }

    enqueueUpdate(current, update)

    scheduleWork(current, expirationTime)
    return expirationTime
}
```
[createUpdate](./ReactUpdateQueue.md#createUpdate)
[enqueueUpdate](./ReactUpdateQueue.md#enqueueUpdate)
[scheduleWork](./ReactFiberScheduler.md#scheduleWork)

创建一个更新； 将

## unbatchedUpdates

<!-- ReactFiberScheduler -->

```javascript
function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
	if (isBatchingUpdates && !isUnbatchingUpdates) {
		isUnbatchingUpdates = true;
		try {
			return fn(a);
		} finally {
			isUnbatchingUpdates = false;
		}
	}
	return fn(a);
}
```

根据 `isBatchingUpdates` `isUnbatchingUpdates` 将参数二当做第一个函数的参数执行

1. 如果当前正在批量更新 且没有不批量更新  存在 则将`isUnbatchingUpdates`置为 true 返回函数执行结果 并将`isUnbatchingUpdates`置为 false；
2. 直接返回执行结果

