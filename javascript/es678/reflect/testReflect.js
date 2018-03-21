let a = {
    a: 1,
    b: 2,
    get sum() {
        console.log(this, '/????')
        return this.a + this.b
    }
}

let b = {
    a: 2,
    b: 3,
}

console.log(Reflect.get(a, 'sum', b))