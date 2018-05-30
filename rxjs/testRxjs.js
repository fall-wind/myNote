// console.log(1)
// 创建一个Observable
let ober = Rx.Observable.create(function(observer) {
    observer.next('sss')
    // observer.error('jjj')
    observer.next('vvv')
    observer.complete()
	setTimeout(() => {
        observer.next('fffff')
	})
})

// console.log(2)

// 简单的输出值
// ober.subscribe(function(value) {
// 	console.log(value, '???')
// })

// 观察者

const observer = {
	next(value) {
		console.log(`observer: `, value)
	},
	error(err) {
		console.log(`l am error, msg: ${err}`)
	},
	complete() {
        console.log(`l am complete`)
    },
}

const observer1 = {
	next(value) {
		console.log(`observer1: ${value}`)
	},
	error(err) {
		console.log(`l am error1, msg: ${err}`)
	},
	complete(value) {
        console.log(`l am complete${value}`)
    },
}

// ober.subscribe(observer)
// ober.subscribe(observer1)

// console.log(3)

// 使用操作符创建observable

let arr = ['ss', 'ddd', 'gggg', 'ttt']

const set = new Set().add(111).add(222).add(333)

const str = 'jasjsdj'

const pro = new Promise(function(resolve, reject) {
    console.log('jjjj')
    setTimeout(() => resolve('fff'), 2000)
})

const source = Rx.Observable.fromEvent(document.getElementById('rxDom'), 'blur')
const eventObserver = {
    next(e) {
        console.log(e.target.value)
    }
}
let subscription = source.subscribe(eventObserver)
// from 有 iteration借口的结构

// Events observable 盡量不要用 unsubscribe
setTimeout(() => {
    subscription.unsubscribe()
}, 10000)

let ober1 = Rx.Observable.from(pro)

ober1.subscribe(observer)
