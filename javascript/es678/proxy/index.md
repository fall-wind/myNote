## 概述

Proxy


## 问题

```
const obj = new Proxy({}, {
    get: function(a, b, c) {
        console.log(a, b, c, 'get')
        return 35
    },
})

// obj.a = 1
console.log(obj.a)
```

会报错```RangeError: Maximum call stack size exceeded```

为什么？？