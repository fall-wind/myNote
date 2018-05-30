function* aa(arr) {
    for(let a of arr) {
        yield a
    }
}

let a = aa([1,2,3,45,6])

console.log(a.next())
console.log(a.next())
console.log(a.next())
console.log(a.next())
