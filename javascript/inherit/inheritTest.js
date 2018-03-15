// 组合继承

function Sup(a, b) {
    this.a = a
    this.b = b
}

function Sub(...args) {

    Sup.apply(this, args)
}

Sub.prototype = new Sup()
Sub.prototype.constructor = Sub
Sub.prototype.sayA = function() {
    console.log(this.a)
    return this.a
}

let a = new Sub(1,2)

console.log(a.a, a.b, a.sayA())


// Object.setPrototypeOf()

// 寄生组合继承

function _inherit(sub, sup) {
    var prototype = Object(sup.prototype)
    prototype.constructor = sub
    sub.prototype = prototype
}


function Super1() {};

function Sub1() {
    // 使用构造函数来继承属性
    Super1.call(this);
};

// 使用寄生来混入原型链
_inherit(Sub1, Super1);

// 生成实例
var sub = new Sub1();