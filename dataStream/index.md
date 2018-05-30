# 数据管理

## redux

函数式、不可变、模式化

嵌套层级深的情况 配合immut

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
- Object.assign
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



## mobx


## rxjs

响应式 以流的方式实现

redux-obserable



## 阅读链接

- [https://www.zhihu.com/question/28016223](https://www.zhihu.com/question/28016223)
- [https://github.com/ascoders/blog/issues/26](https://github.com/ascoders/blog/issues/26)