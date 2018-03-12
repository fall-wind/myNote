## q

### redux 中间件的执行顺序

一个中间件长这个样子

```
function middleware(store) {
    return (next) => (action) => {
        // some self logic
        next(action)
    }
}
```

applyMiddlewares 长这样样子

```
function compose(...funs) {
    if (funs.length === 0) {
        return arg => arg
    }
    if (funs.length === 1) {
        return funs[0]
    }
    return funs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState, enhancer) => {
        const store = createStore(reducer, preloadedState, enhancer)
        let dispatch = store.dispatch
        const middlewareAPI = {
            dispatch: (action) => dispatch(action),
            getState: store.getState,
        }
        const chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = compose(...chain)(dispatch)
        return {
            ...store,
            dispatch,
        }
    }
}
```

在chain中的middleware, 即被compose的函数：  
```
(next) => (action) => {
        // some self logic
        next(action)
    }
```

假设有 a b c两个中间件

```
const middlewares = [a, b, c]

// compose(middlewares)调用后：  

const composeABC = (...args) => a(b(c(...args)))

// dispatch:

let dispatch = a(b(c(dispatch)))

// 为了好标记

let c1 = c(dispatch)
let bc1 = b(c1)
let abc1 = a(bc1)

c1 = (action) => {
    // some c logic
    dispatch(action)
}

bc1 = (action) => {
    // some b logic
    c1(action)
}

abc1 = (action) => {
    // some a logic
    bc1(action)
}

// 最后 
dispatch = abc1
dispatch(action)

// some a logic
// some b logic
// some c logic
// dispatch logic

```

