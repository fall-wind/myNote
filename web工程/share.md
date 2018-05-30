# 数据管理

## redux

函数式、不可变、模式化

嵌套层级深的情况 配合immut

可变性与不可变性：

```
const a = {a: 1}
const b = a
a.a = 2

console.log(b)
```

可变的好处是节省内存或是利用可变性做一些事情  
在复杂的开发中它的副作用远比好处大的多

浅拷贝：

- Object.freeze
- jquery $.extend
- Object.assign
- 解构操作符

深拷贝

- JSON.stringify + JSON.parse 不推荐
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
    const { id,  } = action
    return {
        ...state,
        a: {
            b: {
                ...b,
                c: 'haha'
            }
        }
    }
}

```

### immutableJS

## mobx


## rxjs

响应式 以流的方式实现

redux-obserable



## 阅读链接

- [https://www.zhihu.com/question/28016223](https://www.zhihu.com/question/28016223)
- [https://github.com/ascoders/blog/issues/26](https://github.com/ascoders/blog/issues/26)