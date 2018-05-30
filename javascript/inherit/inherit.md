# new一个实例

1. 创建一个空对象
2. 设置新对象的__proto__属性指向构造函数的prototype对象
3. call构造函数的内部方法，把其中的this赋值为新创建的对象obj，并传入所需参数。
4. 执行构造函数，并返回创建的对象

## prototype 与 __proto__

```prototype```用于”类”上，用于构建实例的```__proto__```，
对于构造函数来说，prototype是作为构造函数的属性；
对于对象实例来说，prototype是对象实例的原型对象。所以prototype即是属性，又是对象


<!-- __proto__ -->

### prototype属性的作用

为了解决构造函数的对象实例之间无法共享属性的缺点，js提供了prototype

js的每种数据类型都是对象（除了null和undefined），而每个对象都继承自另外一个对象，后者称为“原型”（prototype）对象，只有null除外，它没有自己的原型对象。

原型对象上的所有属性和方法，都会被对象实例所共享


## 继承

javaScript的继承 是基于原型链的继承：

### 构造函数方式

``` javaScript

function Super(a) {
    this.a = a
    this.sayA = function() {
        return a
    }
}

let a = new Super(1)
let b = new Super(2)

console.log(a.sayA === b.sayA)
// false

// 这样内部的函数就不能达到复用的目的

```

修改构造函数的原型对象 会切断已有实例和新原型之间的联系

### 组合继承

最常用的继承方式，比较

### 原型式继承

借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型

``` javaScript

function _object(o) {
    function F() {};
    F.prototype = o;
    return new F();
}

var Super = {}
var sub = _object(Super)

```

es5中的Object.create与_object实现类似，都是用来创建新对象，即副本。


### 寄生式继承

由于不能达到函数复用，导致效率变低，这与构造函数模式类似


### 寄生组合继承

寄生组合式继承，即通过构造函数来继承属性，通过原型链的混成形式来集成方法。
基本思路是不必为了指定子类型的原型而调用超类型的构造函数

## 阅读链接


