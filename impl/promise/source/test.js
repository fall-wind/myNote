// const p1 = new Promise(function(resolve, reject) {
//     console.error('11111')
//     resolve('11111')
// })

// const p2 = new Promise(function(resolve, reject) {
//     console.error(111)
//     resolve('22222')
// }).then(result => {
//     console.error(result, '32222')
//     return new Promise(function(resolve, reject) {
//         setTimeout(() => {
//             resolve('66666')
//         }, 2000)
//     })
// }).then(result => {
//     console.error(result, '5555')
// })

const p3 = new Promise(function(resolve) {
    console.error(11111)
    resolve('111111')
}).then().then(() => {
    console.error(44444)
})

// Promise.resolve().then(() => {
//     console.error(55555)
// })

// console.error(33333)