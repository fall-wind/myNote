const obj = new Proxy({}, {
    get: function(target, key, receiver) {
        // console.log(a, b, 'get')
        return Reflect.get(target, key, receiver)
    },
    set: function(target, key, value, receiver) {
        return Reflect.set(target, key, value, receiver)
    }
})

// obj.a = 1
console.log(obj.a)
