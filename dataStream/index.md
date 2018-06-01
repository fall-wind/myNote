一个问题引发的

``` JavaScript
case 'changeItemStatus' {
    const { todoList } = state
    const { name } = action
    todoList.forEach(item => {
        if (item.name === name) {
            item.done = !item.done
        }
    })
    return {
        ...state,
        todoList,
    }
}

```

## redux

不可变、纯函数 模式化

嵌套层级深的情况 配合immutableJS

可变性与不可变性：

``` javaScript
const a = {a: 1}
const b = a
a.a = 2

console.log(b)
```

可变的好处是节省内存或是利用可变性做一些事情，在复杂的开发中它的副作用远比好处大的多

浅拷贝：

- Object.freeze
- jquery $.extend
- 解构操作符

PureComponent组件做的其实就是对原来的Component组件的shouldComponentUpdate做了一层对新旧state props的比较，类似于

``` javaScript

Component.prototype.shouldComponentUpdate = function(nextProps, nextState) {
    const { props: oldProps, state: oldState } = this
    return !isShallowEqual(nextProps, oldProps) || !isShallowEqual(nextState, oldState)
}

```

深拷贝

- JSON.stringify + JSON.parse 不推荐
- deepClone方法
- immutableJS

使用浅拷贝繁琐点在于深层次对象的赋值书写起来很麻烦。

如：改变c的值

``` javaScript
const initState = {
    a: {
        b: {
            c: 1,
        }
    }
}

case 'changeC': {
    const { val } = action
    return {
        ...state,
        a: {
            b: {
                ...b,
                c: val,
            }
        }
    }
}

```

### immutableJS

[官方文档](https://github.com/facebook/immutable-js/blob/master/README.md)

Immutable Data就是一种一但被创建就不能被修改的数据。对Immutable对象的任何修改操作都会返回一个新的Immutable对象。类比于数组的concat, slice, filter,map方法都会返回一个新的数组，而push unshfit shfit的操作都会改变原来的数组

Immutable实现原理是持久化数据结构，也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时还需要避免深拷贝把所有节点都复制一遍带来的性能损耗

Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享


#### JS对象 与 Immutable对象的互相转换

JS ---> Immutable
``` JavaScript
const obj = { a: 1 }
const map1 = Immutable.fromJS(obj)

```

Immutable --->

``` javaScript
const { Map, List } = require('immutable')
const deep = Map({ a: 1, b: 2, c: List([ 3, 4, 5 ]) })
console.log(deep.toObject()) // { a: 1, b: 2, c: List [ 3, 4, 5 ] }
console.log(deep.toArray()) // [ 1, 2, List [ 3, 4, 5 ] ]
console.log(deep.toJS()) // { a: 1, b: 2, c: [ 3, 4, 5 ] }
JSON.stringify(deep) // '{"a":1,"b":2,"c":[3,4,5]}'
```

#### JS对象与Immutable对象的互相操作

``` javaScript
const { Map, List } = require('immutable')
const map1 = Map({ a: 1, b: 2, c: 3, d: 4 })
const map2 = Map({ c: 10, a: 20, t: 30 })
const obj = { d: 100, o: 200, g: 300 }
const map3 = map1.merge(map2, obj);
// Map { a: 20, b: 2, c: 10, d: 100, t: 30, o: 200, g: 300 }
const list1 = List([ 1, 2, 3 ])
const list2 = List([ 4, 5, 6 ])
const array = [ 7, 8, 9 ]
const list3 = list1.concat(list2, array)
// List [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```
Immutable.js会将 js的数组或者对象都看作为集合；可以利用这一点来获取方便实用本地不具备的方法

注意一点：JS对象的属性都为字符串 而Immutable Map的key值可以为任何类型

#### 深层嵌套

对于深层嵌套的Immutable对象更新 使用updateIn方法

``` javaScript
const nested = fromJS({
	a: {
		b: {
			c: [1, 2, 3, 4],
		},
	},
})

const nested2 = nested.mergeDeep({
	a: {
		b: {
			d: 6,
		},
	},
})

const nested3 = nested2.updateIn(['a', 'b', 'c'], arr => arr.push(3))

const nested4 = nested2.updateIn(['a', 'b', 'd'], d => d * d)
```

#### 相等比较

相等的比较分为值 和引用的比较

``` javaScript
const equal1 = Map({ a: 1, b: 2, c: 3 })
const equal2 = Map({ a: 1, b: 2, c: 3 })

console.log(
	equal1 === equal2,
	equal1 == equal2,
	is(equal1, equal2),
	equal1.equals(equal2),
)
```
#### Seq
特点：

- 不变的数据 Seq一旦创建就不可被修改
- 只执行需要的工作，不会创建Immuntable缓存数组

## [mobx](https://cn.mobx.js.org/)

它通过透明的函数响应式编程(transparently applying functional reactive programming - TFRP)使得状态管理变得简单和可扩展
MobX背后的哲学很简单:

任何源自应用状态的东西都应该自动地获得


### 核心概念

#### Observable State（可观察的状态）

#### Computed values（计算值）

#### Reactions(反应)
MobX 会对在执行跟踪函数期间读取的任何现有的可观察属性做出反应。

#### Actions(动作)

状态应该以某种方式更新

异步的actions 感觉有点像redux-thunk中间件的写法

### [Immer.js](https://zhuanlan.zhihu.com/p/34691516)

[https://github.com/mweststrate/immer](https://github.com/mweststrate/immer)


## 阅读链接

- [https://www.zhihu.com/question/28016223](https://www.zhihu.com/question/28016223)
- [https://github.com/ascoders/blog/issues/26](https://github.com/ascoders/blog/issues/26)
- [https://zhuanlan.zhihu.com/p/27133830](https://zhuanlan.zhihu.com/p/27133830)
- [https://cn.mobx.js.org/](https://cn.mobx.js.org/)
- [https://ckinmind.github.io/mobx-share](https://ckinmind.github.io/mobx-share)
- [https://zhuanlan.zhihu.com/p/34691516](https://zhuanlan.zhihu.com/p/34691516)