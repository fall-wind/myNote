## js异步的实现

1. 所有同步的任务都在js主线程上执行，形成一个执行栈
2. 还有一个任务队列Event loop，异步任务在event table中注册函数；当满足触发条件时，回调函数被推入任务队列
3. 一旦执行栈中所有同步任务都被执行完毕后，系统就会读取任务队列，看看里面有哪些事件.那些对应的异步任务, 于是结束等待状态, 进入执行栈, 开始执行
4. 主线程不断重复上面第三步


## 宏任务与微任务

1. 执行一个宏任务，如果过程遇到微任务，就将其放置到微任务的“事件队列”中
2. 当前宏任务执行完成后，会查看微任务的“事件队列”，并将里面全部的微任务依次执行完
3. 重复以上两步操作

### 宏任务（macro-task）

包括：

- script整体代码 
- setTimeout 
- setInterval 
- setImmediate 
- I/O
- UI rendering

### 微任务（micro-task）

- process.nextTick
- Promise
- [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) (监听dom节点的变化，执行回调函数)
- MessageChannel

other question： 

vue的nextTick为何使用microtask???  

JS 的 event loop 执行时会区分 task 和 microtask，引擎在每个 task 执行完毕，从队列中取下一个 task 来执行之前，会先执行完所有 microtask 队列中的 microtask。

HTML标准中， 在每个task运行后， UI都会渲染， 那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。反之如果新建一个 task 来做数据更新，那么渲染就会进行两次

[问题链接](https://www.zhihu.com/question/55364497)


## 优先级

idle观察者>> io观察者 >> check观察者

按先后顺序排布

- process.nextTick
- setTimeOut
- setImmediate