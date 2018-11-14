# [immer](https://github.com/mweststrate/immer)

## 用法
``` javaScript
import producer from 'immer'

const nestedObj = {
    value: 0,
    firstLevelObj: {
        value: 1,
        secondLevelObj: {
            value: 2,
            thirdLevelObj: {
                value: 3,
            }
        }
    }
}

const newObj = producer(nestedObj, draftState => {
    draftState.firstLevelObj.secondLevelObj.thirdLevelObj.value = '33'
})


```

## 源码

### 创建

```javascript
export function produceProxy(baseState, producer, patchListener) {
    if (isProxy(baseState)) {
        // See #100, don't nest producers
        const returnValue = producer.call(baseState, baseState)
        return returnValue === undefined ? baseState : returnValue
    }
}
```
如果baseState是Proxy对象 直接返回将produce的执行结果（将this绑定在baseState）


创建一个可以被取消的Proxy

```javascript
function createState(parent, base) {
    return {
        modified: false, // 是否被修改
        finalized: false,
        parent,
        base,
        copy: undefined, // 浅拷贝
        proxies: {}
    }
}
```

Proxy实例对象的set方法返回一个布尔值 true表示设置成功 false在严格模式下返回一个TypeErrir

### set

```javascript
function set(state, prop, value) {
    // 如果当前state未被修改过 
    if (!state.modified) {
        if (
            (prop in state.base && is(state.base[prop], value)) || // 
            (has(state.proxies, prop) && state.proxies[prop] === value) // 这种什么情况？ get时候 值修改为Proxy
        )
            return true
        markChanged(state)
    }
    state.copy[prop] = value
    return true
}
```

以上分析：如果对draftState设置一个值  
如果当前state未被修改过 且修改的值与旧值相等 则返回；否则，标志当前对象为被修改状态;  
如果state被修改过 将值附给state.copy对象

```javascript
function markChanged(state) {
    if (!state.modified) {
        state.modified = true
        state.copy = shallowCopy(state.base)
        // copy the proxies over the base-copy
        Object.assign(state.copy, state.proxies) // yup that works for arrays as well
        if (state.parent) markChanged(state.parent)
    }
}
```

* 将 modified 置为true 
* 复制一份浅拷贝 并将proxies合并
* 递归对state的parent进行标记

### get
```javascript
function get(state, prop) {
    if (prop === PROXY_STATE) return state
    if (state.modified) {
        const value = state.copy[prop]
        if (value === state.base[prop] && isProxyable(value))
            // only create proxy if it is not yet a proxy, and not a new object
            // (new objects don't need proxying, they will be processed in finalize anyway)
            return (state.copy[prop] = createProxy(state, value))
        return value
    } else {
        if (has(state.proxies, prop)) return state.proxies[prop]
        const value = state.base[prop]
        if (!isProxy(value) && isProxyable(value))
            return (state.proxies[prop] = createProxy(state, value))
        return value
    }
}
```
疑问： 为什么获取的时候 value为一个可被代理的对象 要创建一个Proxy？  
获取对象属性

### finalize

返回一个非Proxy对象
