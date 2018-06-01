const a = {
	a: {
		b: {
			c: 1,
		},
	},
}

const newA = new Proxy(a, {
	get(target, key, id) {
        console.log('proxy get key', key)
        return new Reflect(id)
	},
	set(target, key, value) {
		console.log('value', value)
	},
})

console.log(newA.a)