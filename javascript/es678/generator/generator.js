function * a1() {
    yield 1;
    yield 2;
}

function * a() {
    yield* a1()
    // yield 3
    // yield 3
    // yield 3
    // yield 3
}

let b = a()

// console.log(b.next())
// console.log(b.return('jj'))

for (let ss of b) {
    console.log(ss)
}

function* gen(){
    yield* "wo hahahh sdd dd"
}

for(let g of gen()) {
    console.log(g, '??')
}

console.log("ssjjj"[Symbol.iterator])
