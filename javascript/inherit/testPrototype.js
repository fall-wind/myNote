function Person(name) {
    this.name = name
}

// Person.prototype.sayName = function () {
//     console.log(this.name)
// }

const my = new Person('yt')
Person.prototype = {
    constuctor: Person,
    sayName: function() {
        console.log(this.name)
    }
}

// my.sayName()

const her = new Person('mzr')

her.sayName()
