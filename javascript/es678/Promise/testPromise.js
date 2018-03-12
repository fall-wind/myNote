function timeOut(ms) {
	return new Promise((resolve, reject) => {
		try {
			setTimeout(() => {
				resolve({ a: 'a', b: 'b', c: 'c' })
			}, ms)
		} catch (error) {
			reject(error)
		}
	})
}

const a = timeOut(1000).then((...args) => {
    console.log(...args)
    return {
        a: 111,
    }
}).then((a) => {
    console.log(a)
})

console.log(a, '....')

setTimeout(() => {
    console.log(a, '.....')
}, 1008)
