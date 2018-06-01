const produce = require('immer').default

const a = {
    b: {
        c: 1
    }
}

const arr = [
    {
        a: 1,
        b: 1,
    },{
        a: 2,
        b: 3,
    }
]

const newA = produce(a, copyA => {
    copyA.b.c = 2
})

const newArr = produce(arr, copyArr => {
    copyArr.push({
        a: 3,
        b: 3
    })
    copyArr[0].a = 'sssss'
})

console.log(a)
console.log(newA, '????')
console.log(arr, newArr, '????')
