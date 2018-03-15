// const LPromise = require('./LPromise')

// import LPromise from './LPromise'

// function timeOut(ms) {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			setTimeout(() => {
// 				resolve({ a: 'a', b: 'b', c: 'c' })
// 			}, ms)
// 		} catch (error) {
// 			reject(error)
// 		}
// 	})
// }

// const a = timeOut(1000).then((...args) => {
//     console.log(...args)
//     return {
//         a: 111,
//     }
// }).then((a) => {
//     console.log(a)
// })

// console.log(a, '....')

// setTimeout(() => {
//     console.log(a, '.....')
// }, 1008)

// const p1 = new Promise(function(resolve) {
// 	console.log('1111')
// 	resolve({ a: 1, b: 2 })
// })

// const p2 = p1.then(function(a) {
// 	console.log(a)
// })

// new Promise((resolve, reject) => {
// 	resolve(1)
// 	console.log(2)
// }).then(r => {
// 	return new Promise(function(resolve, reject) {
//         // throw new Error('l am wrong...')
//         reject(3)
//         console.log(r)
//     })
// }).catch(e => {
//     console.log(e, '???')
//     return new Promise(function(resolve, reject) {
//         resolve(5)
//     })
// }).then(r => {
//     console.log(r, 'sss')
// })

// 返回定时器

// const timeout = ms => {
// 	return new Promise(function(resolve, reject) {
// 		try {
// 			setTimeout(resolve, ms)
// 		} catch (error) {
// 			reject(error)
// 		}
// 	})
// }

// timeout(1000).then(function() {
// 	console.log('??????')
// })

// setTimeout(function() {
// 	console.log('three')
// }, 0)

// LPromise.resolve().then(function() {
// 	console.log('two')
// })

// console.log('one')

// setTimeout(function() {
// 	console.log('three')
// }, 0)

// Promise.resolve().then(function(result) {
// 	console.log('two')
// })

// console.log('one')

// const a = ( async () => console.log('a hahah'))

// a().then(() => {
//     console.log('jjjjj')
// })

// let p = Promise.resolve('出错了').then(() => {
//     console.log('jjjj')
//     return new Promise(function(resolve, reject) {
//         resolve(5)
//     })
// }).then((err) => {
//     console.log(err)
//     console.log('fffff')
// })

function timerFunc(fn) {
	let macroTimerFunc = () => {
		setTimeout(fn, 0)
	}
	if (typeof window !== undefined) {
		if (typeof MutationObserver !== 'undefined') {
			let counter = 1
			let observer = new MutationObserver(fn)
			var textNode = document.createTextNode(String(counter))
			observer.observe(textNode, {
				characterData: true,
			})
			macroTimerFunc = () => {
				counter = (counter + 1) % 2
				textNode.data = String(counter)
			}
		} else if (typeof MessageChannel !== 'undefined') {
            const channel = new MessageChannel()
            const port = channel.port2
            channel.port1.onmessage = fn
            macroTimerFunc = () => {
                port.postMessage(1)
            }
        }
	} else {
		if (process && process.nextTick) {
			macroTimerFunc = () => process.nextTick(fn)
		}
	}
	macroTimerFunc()
}

setTimeout(() => {
	console.log('2222')
}, 0)

timerFunc(() => {
	console.log('11111')
})

console.log('???')
