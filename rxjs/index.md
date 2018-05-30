## 简介

rxjs被成为FRP即函数式编程+响应式编程


Observer 与 Iterator

渐进式地获取数据 差别在于  
Observer是生产者（Producer）推送数据（push） 而Iterator 是消費者（Consumer）请求数据（pull）!


Observable就是这两个模式的结合：  
Observable具有生产者推送资料的特性，同时能像序列，拥有序列处理资料的方法

訂閱一個 Observable 就像是執行一個 function

## 应用

### 使用操作符

### Operator

Operators 就是一個個被附加到 Observable 上的函数，像map, filter

#### concatAll

concatAll将observable扁平化

### takeLast

等待整个observable完成（complete）才能知道最后的元素有哪些，最后同步送出

### concat

将多个observable合成一个  

必须等前一个 observable 完成(complete)，才会继续下一個


### startWith

startWith的值是一开始就同步发出的 这个operator常用来保存程序的其实状态

### merge

merge将多个observable同时处理

### combineLatest

取得各个observable最后的送出的值，在输出成同一个值


### withLatestFrom

withLatestFrom与combineLatest有点相似，不过这个游主从关系，只有在主的observable发送新值时，才会执行callback

### zip

zip会取得每个observablex相同位置的元素并传入callback

### scan
类别数组的reduce操作

### buffer相关

- buffer
- bufferCount
- bufferTime
- bufferToggle
- bufferWhen

### delay delayWhen

delay延迟obervable开始的时间

delayWhen影响每一个obervable返回值元素的时机

### throttle 和 debounce

### distinct distinctUntilChanged


### 错误处理

- catch
- retry
- retryWhen
- repeat

### 将高阶Observable扁平化
将二维的Observable转换成一维的Observable
#### concatAll

concatAll 等待前一个observable完成 再去执行下一个

#### switch

switch不管前一个Observable是否完成 它只处理最新的observable，将旧的Observable退订(unsubscribe)

#### mergeAll

所有的Observable并行处理

### concatMap

concatMap表示 map + concat

### switchMap

### window相关

- window
- windowCount
- windowTime


### groupBy

### multicast
组播

挂载subject并回传一个可连结connectabled的observable  

通过multicast来挂载一个subject之后这个observable(source)的订阅都是订阅到subject上  

等到调用source的connect后才会真的用subject订阅source，并开始输送元素  
不执行connect observable是不会真正执行的  

退订：将connect回传的subscription退订c爱会真正停止observable

### refCount

必须搭配multicast一起使用，这建立起一个只要有订阅就会自动connectd的observable  

当订阅数从0 到 1 立即执行发送元素  
当退订时只要訂閱數變成 0 就会自动停止发送

### publish

就相当于：

```
multicast(new Rx.Subject())

// publish
publish
```

### share

```
multicast(new Rx.Subject()).refCount()

// share
share()
```

## Subject总结

### 一定要使用subject的时机

一个observable的操作过程中发生了side-effect,而我们不希望这个side-effect因为多个subscribe被触发多次

## 深入 Observable

- 延迟运算
- 渐进式取值

延迟运算： 一个Observable不被订阅 j就不会运算

渐进式取值： 一次运算到底

## Subject

observable可以被多次订阅

每次订阅都建立了一次执行

- Subject
- BehaviorSubject: 参数为状态
- ReplaySubject: 参数为重复订阅最后几个值，为事件的重放
- AsyncSubject： subject 結束後送出最後一個值


## 阅读链接

- [https://ithelp.ithome.com.tw/articles/10186703](https://ithelp.ithome.com.tw/articles/10186703)
- [响应式编程定义](https://zh.wikipedia.org/wiki/%E5%93%8D%E5%BA%94%E5%BC%8F%E7%BC%96%E7%A8%8B)