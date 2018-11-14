function commonGet(itemKey) {
    return function get(target, key) {
        if (key in target) {
            console.error(itemKey, 'xxxxxxx')
            return target[key]
        }
        return true
    }
}

let thirdLevelObjProxy = new Proxy(
	{
		value: 3,
    },
    {
        get: commonGet('third')
    }
);

let secondLevelObjProxy = new Proxy({
    value: 2,
    thirdLevelObj: thirdLevelObjProxy,
}, {
    get: commonGet('second')
})

let firstLevelObjProxy = new Proxy({ value: 1, secondLevelObj: secondLevelObjProxy }, {
    get: commonGet('first')
})

const nestedObj = {
    value: 0,
    firstLevelObj: firstLevelObjProxy,
	// firstLevelObj: {
	// 	value: 1,
	// 	secondLevelObj: {
	// 		value: 2,
	// 		thirdLevelObj: {
	// 			value: 3,
	// 		},
	// 	},
	// },
};

console.error(nestedObj.firstLevelObj)
// console.error(nestedObj.firstLevelObj.secondLevelObj.thirdLevelObj.value)
