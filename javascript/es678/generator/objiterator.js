let obj = {a: 1, b: 2}

// way1

// Object.defineProperty(obj, Symbol.iterator, get)

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

for (let [key, value] of setIterator(obj)) {
    console.log(key, value, 222)
}

const [a, ...b] = obj
console.log(a, b)

// for (let a of [1,2,3,4]) {
//     console.log(a)
// }