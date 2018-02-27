## 介绍
react fiber是对React的核心算法的重新实现

目的是增加对动画、布局、手势的适应性;  
包括在下次的更新来临时中断、中止、重用 ```work```  
为不同类型的更新分配优先权  


## 回顾

几个重要的概念：

### 什么是reconciliation
reconciliation:  
react比较当前虚拟树与要更新的虚拟树来决定哪些部分需要更新算法  

update:  
数据的变化用来渲染react应用。通常是setState的结果。最终引发一次re-render。

每次变化都需要re-render整个应用，这在真实的项目中是不行的。React对这种情况进行了优化，这些优化即是所谓的```reconciliation```的一部分

```Reconciliation```是通常被大家理解为‘虚拟dom’背后的算法；可以概括为：当你渲染一个app是 虚拟树所描述的树形节点们被生成并保存在内存中，然后被一口气渲染到对应的环境中

虽然Fiber是对```reconciler```的彻底重写，但核心算法还是大致相同的：

- 不同类型的组件react会直接重新渲染并替换他
- 使用keys来diff数组，keys应该是稳定的、可预测的、独特的（在同一list内）

### Reconciliation 和 rendering

DOM只是react可以渲染的一种渲染环境，其他的可以通过React Native渲染的native iOS和Android

所以React被设计成```Reconciliation```和```rendering```分开以至于它支持多平台；```reconciler```负责计算树的哪些部分已经改变了；```renderer```使用这些信息来更新被渲染的app

Fiber重新实现了```reconciler```,它不涉及到渲染；虽然rerender需要重新实现去适应新的Fiber

### Scheduling

Scheduling:  
确定work何时被执行

work：  
必须执行的计算，work通常是一次更新的结果（e.g. setState）

- UI库没必要立即地去调用每个更新，事实上，这样不仅浪费还可能导致掉帧影响客户的体验
- 不同类型的更新有着不同的优先级 一次动画的更新应该比数据的更新的优先级更高

## 什么是Fiber？
创建Fiber的主要目的是使React利用```scheduling```的优势；具体的应该做到：  
- 中断和延时work
- 为不同的work分配优先级
- 重用之前完成的工作
- 中止不再使用的work

为了实现上述功能 首先我们需要一个最小的单元；某种意义上，这就是fiber；Fiber就是work的单元

为了更进一步 我们回顾一下一个概念：把react组件当成一个返回数据的函数  
```v = f(d)```

渲染一个react app就如同调用包含其他函数的函数  

一般，计算机跟踪程序执行的方式被称为调用堆栈；当函数被执行时，一个新的栈帧被推到栈中，这个栈帧代表着函数正在执行的work

在处理UI时，如果太多的工作被一次执行，这会导致动画掉帧 断断续续的问题；但这些工作有些没有必要在最近的一次更新中更新；这就是UI组件和函数有区别的地方 组件有更多特殊的问题

最新的浏览器实现API帮忙解决这个头疼的问题：```requestIdleCallback```安排低优先级的function在空闲的期间被调用，```requestAnimationFrame```安排一个高优先级的function在下一个帧中被调用。 问题在于：为了使用这些API 我们需要将rendering work分解成一个增量单元

为了优化渲染UI，我们是否可以自定义调用堆栈的行为？中断调用堆栈并手动实现会不会更好一点？

这就是React Fiber的目的所在 Fiber是为React Component特殊定制的栈。你可以把一个Fiber当做是一个栈帧

重新实现栈的优势在于你可以将栈帧保存下来在任何时候去执行它

### fiber的结构

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

#### type 和 key
这与reactElement中type和key的作用类似；（fiber是根据element来创建的，这两个字段是直接copy的）

#### child 和 sibling

这两个字段都指向其他的fiber，描述fiber的递归树形结构

#### return
return fiber是处理当前fiber之后程序被返回的fiber；这和返回栈帧地址在概念上是相似的；也可以被理解为是parent fiber

#### pendingProps 和 memoizedProps

概念上 props是函数的参数，fiber的pendingProps在执行开始时被设置 memoizedProps在结束时被设置

如果即将到来的pendingProps和memoizedProps相等 则意味着这个Fiber可以被重用，避免不必要的工作

#### pendingWorkPriority
一个代表这个Fiber work优先级的数字  
除了NoWork为0外；大数字代表低的优先级

#### alternate

flush：  
To flush a fiber is to render its output onto the screen  

work-in-progress：  
没有被完成的fiber； 概念上没有被return的栈帧

##### output

react应用的叶子节点 他们具体有rendering的环境决定（e.g. 在浏览器中 他们是'div', 'span', 'p'）

概念上 fiber的output也就是函数的返回值

每个fiber最终都会有output， output只能是被host 组件创建的叶子节点， 最后被反映到树上

