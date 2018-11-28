commit阶段
====
代码位于ReactFiberScheduler.js

`nextEffect`属于当前的全局变量：含义为当前的`commit`中下一个带有`effect`的`fiber`


## commitBeforeMutationLifecycles

在begin阶段已经将Tag给打上了

递归查找当前不为null的effect effect是一个链表结构


## commitAllHostEffect

有以下几种类型：

- Placement 插入
- PlacementAndUpdate 插入并更新
- Update 更新
- Eeletion 删除

根据beginWork打上的tag进行dom操作，insertBefore、appendChild；


## commitAllLifeCycles

`commitAllLifeCycles` --> `commitLifeCycles`:


根据不同的effectTag

classComponent 第一次则调用`componentDidMount`; 更新调用`componentDidUpdate`
接着commitUpdateQueue--> commitUpdateEffects

将`firstCapturedUpdate`加到`finishedQueue`队列中;

- 将`firstCapturedUpdate`列表清空；
- 将effect List清空
- 调用effect上的callback 并将其清空

如果是FunctionComponent、ForwardRef、SimpleMemoComponent，调用commitHookEffectList

