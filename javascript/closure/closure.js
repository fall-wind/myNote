function fn1() {
	var a = 1

	function fn2() {
		debugger
		console.log(a)
	}

	fn2()
}

// fn1();

function a() {
	let a = 0
	return {
		add(x) {
			a += x
			console.log(a)
		},
		reset() {
			a = 0
			console.log(a)
		},
	}
}

let b = a()

b.add(1)
b.add(1)
b.add(1)

b.reset()

function fun(n, o) {
	console.log(o)
	return {
		fun: function(m) {
			return fun(m, n)
		},
	}
}
var a = fun(0)
a.fun(1)
a.fun(2)
a.fun(3) //undefined,?,?,?
// 0 0 0

var b = fun(0)
	.fun(1)
	.fun(2)
    .fun(3) //undefined,?,?,?

// 0 1 2

var c = fun(0).fun(1)
c.fun(2)
c.fun(3) //undefined,?,?,?

// 0 1 1
