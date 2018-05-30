function Super() {
    this.type = 'ssss'
}

function Sub() {
    this.subType = 'sub'
}

const superType = new Super()

Sub.prototype = superType

Sub.prototype.getSubType = function () {
    return this.subType
}

const sub = new Sub()

const csKey = 'constructor'

console.log(sub.getSubType(), Object.hasOwnProperty.call(Super.prototype, csKey))

console.log(sub.__proto__.constructor, sub.__proto__);

console.log(Object.hasOwnProperty(sub.__proto__, csKey));
