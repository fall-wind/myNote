function Super() {
    this.type = 'ssss'
    this.sameNameKey = 'super'
}

Super.prototype.getSuperType = function() {
    return this.type
}

function Sub() {
    this.subType = 'sub'
    this.sameNameKey = 'sub'
}

const superType = new Super()

Sub.prototype = superType

Sub.prototype.getSubType = function () {
    return this.subType
}

Sub.prototype.getSameNameKey = function () {
    return this.sameNameKey
}

const sub = new Sub()

const csKey = 'constructor'
// console.log(sub.__proto__)
// console.log(sub.__proto__, sub.__proto__.constructor, sub.__proto__.constructor.prototype === Super.prototype)
console.log(sub.getSubType())

// console.log(sub.getSubType(), Object.hasOwnProperty.call(Super.prototype, csKey))

// console.log(sub.__proto__.constructor, sub.__proto__);

// console.log(Object.hasOwnProperty(sub.__proto__, csKey));
