const obj = new Proxy({}, {
    get: function(a, b, c) {
        console.log(a, b, 'get')
        return c
    },
    set: function(target, key) {
        console.log(target, key)
    }
})

// obj.a = 1
console.log(obj.a)
