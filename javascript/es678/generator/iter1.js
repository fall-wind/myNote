const genArr = function * () {
    yield 1
    yield* [1, 2, 3, 4]
    yield 3
}

let fun1 = genArr()

console.log([...fun1])

for (let a of "sssjjs") {
    console.log(a)
}