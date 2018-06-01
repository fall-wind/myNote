const Immutable = require('immutable')
const Cursor = require('immutable/contrib/cursor')

const { List, Map, Seq, fromJS, is } = Immutable

// let data = Immutable.fromJS({ a: { b: { c: 1 } } })
// let cursor = Cursor.from(data, ['a', 'b'], newData => {
// 	data = newData
// })

// console.log(cursor.get('c'))
// cursor = cursor.update('c', x => x+ 1)
// console.log(cursor.get('c'))
// console.log(cursor)
// console.log(data, '???')

// const list1 = List(['1', '2', '3'])

// const list2 = list1.push('3')

// console.log(list1, list2, list1.get(0), list2.size)

const map1 = Map({
	a: 1,
	b: 2,
	c: 3,
	d: 4,
})

// console.log(map1.toJS())

// const map2 = map1.map((v, k, map) => {
//     return k.toLocaleUpperCase()
// }).join(',')

// console.log(map2, '???')

// Seq

const myObject = Map({ a: 1, b: 2, c: 3 })

const myObject2 = Seq(myObject)
	.map((x, y, z) => {
		// console.log(x,y,z)
		return x * x
	})
	.filter(x => x % 2 !== 0)
	.toObject()

console.log(myObject2, '????')

const nested = fromJS({
	a: {
		b: {
			c: [1, 2, 3, 4],
		},
	},
})

const nested2 = nested.mergeDeep({
	a: {
		b: {
			d: 6,
		},
	},
})

const nested3 = nested2.updateIn(['a', 'b', 'c'], arr => arr.push(3))

const nested4 = nested2.updateIn(['a', 'b', 'd'], d => d * d)

// console.log(nested3.toJS(), nested4.toJS(), nested4.getIn(['a','b','d']))

const nestedArr = fromJS([
	{ a: 1, b: 2, c: { d: 3, e: 3, f: [1, 2, 3, 4] } },
	{ a: 11, b: 22 },
])

// console.log(nestedArr.getIn([0, 'c', 'd']))

const nestedArr1 = nestedArr.updateIn([0, 'c', 'd'], val => val + 1)
const nestedArr2 = nestedArr.updateIn([0, 'c', 'f'], arr => arr.push(9999))

// console.log(nestedArr.getIn([0, 'c', 'd']))
// console.log(nestedArr, nestedArr1, nestedArr2)

const equal1 = Map({ a: 1, b: 2, c: 3 })
const equal2 = Map({ a: 1, b: 2, c: 3 })

// console.log(
// 	equal1 === equal2,
// 	equal1 == equal2,
// 	is(equal1, equal2),
// 	equal1.equals(equal2),
// )

const list1 = List([1, 2, 3])
const list2 = list1.withMutations(function(list) {
	list
		.push(4)
		.push(5)
		.push(6)
})

// console.log(list1, list2)
