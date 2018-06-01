// console.log(Immutable)

// 对象
let map1 = Immutable.Map({
	a: 1,
	b: 2,
	c: 3,
})

let map2 = map1.set('b', 50)

let clone = map1

let clone1 = clone.set('b', 51)

console.log(map1 === map2, clone === map1)

let obj = {
	a: {
		b: {
			c: 1,
        },
        
	},
}

let objMap1 = Immutable.fromJS(obj)

let objMap2 = objMap1.setIn(['a', 'b', 'c'], 100)
console.log('objMap1:', objMap1.getIn(['a', 'b', 'c']), objMap2.getIn(['a', 'b', 'c']))
// 

// 对象
let list1 = Immutable.List([1, 2, 3, 4])

// console.log('list1', list1, [...list1])

// 复杂结构
let obj2 = {
	a: {
		b: [
			{
				c: 1,
				d: 1,
			},
			{
				c: 2,
				d: 2,
			},
		],
		'1': 'l am string',
	},
}

let obj2Map1 = Immutable.fromJS(obj2)
const obj2MapKeyArr = ['a', 'b', 0, 'c']
let obj2Map2 = obj2Map1.setIn(obj2MapKeyArr, 3)

console.log(obj2Map1.getIn(obj2MapKeyArr), obj2Map2.getIn(obj2MapKeyArr))
console.log(obj2Map1.getIn(['a', 1]), obj2Map1.getIn(['a', '1']))
console.log(obj2Map1.getIn(['a']) === obj2Map2.getIn(['a']))
console.log(obj2Map1.getIn(['a','b']) === obj2Map2.getIn(['a','b']))
console.log(obj2Map1.getIn(['a','b', 1]) === obj2Map2.getIn(['a','b', 1]))

// console.log(obj2Map2.toJS(), obj2Map2.toJS().a['1'])

const obj2Map3 = obj2Map1.setIn(
	['a', 'b'],
	obj2Map1.getIn(['a', 'b'].filter(x => x.c === 1)),
)

const obj2Map3Arr = obj2Map3.getIn(['a', 'b'])

console.log(obj2Map1.getIn(['a', 'b'].filter(x => x.c === 1)).toJS())

console.log(
    obj2Map3,
    obj2Map3.getIn(['a', 'b'])
)
// 游标

// let cursor = Immutable.Cursor.from(obj2Map1, ['a', 'b', 0], (newData) => {
//     return {
//         c: 'Cursor',
//         d: 'Cursor'
//     }
// })

// console.log(cursor, '???')

// 比较

let compareObj1 = Immutable.Map({ a: 1, b: 2 })
let compareObj2 = Immutable.Map({ a: 1, b: 2 })

let set1 = Immutable.Set().add(compareObj1)

// console.log(compareObj1 === compareObj2)
// console.log(Immutable.is(compareObj1, compareObj2))
// console.log(set1.has(compareObj2)) // value-equal

// Seq

// Range

// let value = Immutable.Range(1, Infinity)
// 	.skip(1000)
// 	.map(n => -n)
// 	.filter(n => n % 2 === 0)
// 	.take(2)
// 	.reduce((r, n) => r * n, 1)


// console.log(value)
