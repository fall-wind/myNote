console.log(1)

setTimeout(function() {
    console.log(2)
}, 0)

Promise.resolve().then(() => {
    console.log(3)
    setTimeout(() => {
        console.log(5)
    })
}).then(() => {
    console.log(4)
})