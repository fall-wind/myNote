## generator

### return throw

## 应用

### 为一个对象部署Iterator接口

方法一：为对象部署Symbol.iterator属性

```
function setIterator(obj) {
    obj[Symbol.iterator] = function () {
        let i = 0
        let keys = Object.keys(this)
        return {
            next() {
                if (i < keys.length) {
                    let key = keys[i++]
                    return {
                        value: [key, obj[key]],
                        done: false,
                    }
                }
                return {
                    done: true,
                    value: [undefined, undefined]
                }
            }
        }
    }
    return obj
}

for (let [key, value] of setIterator(obj)) {
    console.log(key, value, 222)
}

```

方法二： 使用generator函数，它自带Iterator接口

```
function *iterEntries(obj) {
    let keys = Object.keys(obj)
    for (let i = 0; i< keys.length; i++) {
        let key = keys[i]
        yield [key, obj[key]]
    }
}

for (let [key, value] of iterEntries(obj)) {
    console.log(key, value, 111)
}
```


## 阅读链接

- [http://es6.ruanyifeng.com/#docs/iterator](http://es6.ruanyifeng.com/#docs/iterator)