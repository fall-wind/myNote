// var a = 1
// function bar() {

//     console.log(a, '???')
//     if (!a) {
//         var a
//         a = 10
//     }
//     console.log(a)
// }

// bar()

if (!('a' in window)) {
	var a = 10
}
console.log(a)
