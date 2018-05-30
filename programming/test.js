function fun1(x) {
    console.log(x, "???")
    return function(y) {
        console.log(y, "???")
    }
}

// 执行 就近原则 😂
fun1('1')('2')