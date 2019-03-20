---
title: react事件系统浅析
date: '2018-12-29'
spoiler: react事件系统浅析
---

源码版本16.7
# 关键点

- 事件委托到document
- 事件的批处理 事件队列的概念;
<!-- - 事件的传播 -->
- 事件的插件机制如何运行 以及各自作用
- 合成事件 事件池 事件的回收

<!-- 
事件的回收 一个事件被处理完就立刻回收吗？事件池存在的意义是为了事件的批处理 事件的批处理又是如何运行的；被persist的事件在什么时候会被回收，是在组件销毁的时候吗？事件对象不存在复用的问题吗？这个对象池是一个对象池还是每一种事件类型就是一个对象池？

同一种事件对象被重用。在一个事件执行完之后，这个事件对象的所有值都会被手动置为null，之后将这个对象push当前合成事件类型的静态属性`eventPool`上. 以便后续同种类型的事件可以重用这个‘初始对象’。 -->


# 概述
React事件系统基于事件委托实现了一套自己事件机制。所有的事件都会被注册到document。  

所有的事件都被注册到document上，使用`dispatchEvent`统一派发。显然处理逻辑的重点在事件的回调上。

React使用自己实现的合成事件对象，这个对象具备原生对象的属性，并自己实现了`stopPropagation`, `preventDefault`等方法

## 事件的注册

## 回调执行
先简述一下这个回调执行的过程：

- 根据native
- 提取事件对象
- 执行事件对象上的回调

### 提取合成事件对象

五种事件插件

- SimpleEventPlugin：简单事件插件，提取基本的合成事件
- EnterLeaveEventPlugin：鼠标移入移出事件，
- ChangeEventPlugin： change事件插件
- SelectEventPlugin： 选择事件
- BeforeInputEventPlugin：

simpleEventPlugin事件返回一个基本的合成事件对象，其他的四种事件主要是做事件的兼容处理， 使得合成事件行为尽量与原生；保证各个浏览器交互一致。

简单看一下提取事件时的代码：

```
function extractEvents(...args) {
    let event = null;
    for (let i = 0; i < plugins; i++) {
        const possiblePlugin: PluginModule<AnyNativeEvent> = plugins[i];
        if (possiblePlugin) {
            const extractedEvents = possiblePlugin.extractEvents(...args);
            if (extractedEvents) {
                events = accumulateInto(events, extractedEvents);
            }
        }
    }
    return event;
}
```

遍历所有的插件，调用`extractEvents`方法，将各自返回的合成事件对象合并，最后返回值可能为`null` 合成事件对象或合成事件对象数组。

每个插件生成合成事件公用逻辑为：

拿冒泡事件举例：先从当前事件类型的事件池中拿到一个事件对象，向上遍历虚拟dom tree找具有相同的事件类型的祖先节点，获取该节点上的回调。
之后将这个实例、回调分别收集到`event`合成对象的`_dispatchListeners`,`_dispatchListeners`属性上。
<!-- 先找到当前`fiber`节点对应的`stateNode`，再调用`getFiberCurrentPropsFromNode`获取`props`，最后从`props`上取得你在代码上设置的回调   -->

### 回调的执行

在执行阶段时 拿到合成对象的`_dispatchInstance`、 `_dispatchListeners`遍历执行；
执行完毕后，将`_dispatchInstance`、 `_dispatchListeners`置为`null`；如果用户没有调用`e.persist()`方法，则将事件对象所有属性清空为`null`会收到当前事件类型的事件池之中。

## 事件队列
// TODO
事件的批处理，即事件队列是怎么形成的？

在`EventPluginHub.js`中，与事件队列对象`eventQueue`相关的方法只有一个方法`runEventInBatch`，方法内只涉及到赋值和置为`null`

```javascript
export function runEventsInBatch(
  events: Array<ReactSyntheticEvent> | ReactSyntheticEvent | null,
) {
  if (events !== null) {
    eventQueue = accumulateInto(eventQueue, events);
  }

  // Set `eventQueue` to null before processing it so that we can tell if more
  // events get enqueued while processing.
  const processingEventQueue = eventQueue;
  eventQueue = null;
  // ....
}
```
这个事件队列让我很疑惑，全局搜索一下`eventQueue`也只有在`EventPluginHub.js`中的`runEventsInBatch`方法有赋值的操作，而js执行又是单线程的，那么每次进入这个方法时，`eventQueue`对象总是为null  

再看看`accumulateInto`这个方法

```javascript
function accumulateInto<T>(
  current: ?(Array<T> | T),
  next: T | Array<T>,
): T | Array<T> {
  if (current == null) {
    return next;
  }
  // ..
}
```
所以可以理解为`eventQueue = events`，为什么不直接这么写尼？ 是老代码没有处理彻底？还是为了以后代码的拓展吗? 

`events`对象是一个数组是为了做浏览器的兼容，使得行为一致，这并不是事件队列




## 推荐阅读文章链接

- [https://www.lzane.com/tech/react-event-system-and-source-code/](https://www.lzane.com/tech/react-event-system-and-source-code/)