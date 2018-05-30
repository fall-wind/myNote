// function map(source, callback) {
//     return Rx.Observable.create(function(observer) {
//         return source.subscribe({
//             next(value) {
//                 observer.next(callback(value))
//             },
//             error(err) {
//                 observer.error(err)
//             },
//             complete() {
//                 observer.complete()
//             }
//         })
//     })
// }

// const source = Rx.Observable.from(['yt', 'cxz', 'jjjjj', 'fff', 'vvv'])

// // const newObj = map(source, value => `hello: ${value}`).filter(value => value === 'hello: yt')

// const newObj = map(source, value => `hello: ${value}`).take(8)

// newObj.subscribe({
//     next(value) {
//         console.log(value, '????')
//     }
// })

// concatAll

const baseObserver = {
	next(e) {
		console.log(e)
	},
	error(err) {
		console.log(err, 'l am error')
	},
	complete() {
		console.log('complete')
	},
}

const observer = {
	next(e) {
		e.subscribe(baseObserver)
	},
	complete() {
		console.log('complete')
	},
}

const source = Rx.Observable.fromEvent(document.body, 'click')

const click = source.map(e => Rx.Observable.from([1, 2, 3, 4]))

const concatAll = click.concatAll()

// // click.subscribe(observer)

// concatAll.subscribe(baseObserver)

const intervalSource = Rx.Observable.interval(1000)

function getIntervalSourceByTime(ms) {
	if (typeof ms === 'number') {
		return Rx.Observable.interval(ms)
	}
	return Rx.Observable.interval(1000)
}

const takeSource = intervalSource.take(6)

const skipSource = intervalSource.skip(3)

const baseSource1 = Rx.Observable.from(['1', '1', '1'])

const baseSource2 = Rx.Observable.from(['2', '2', '2'])

const baseSource3 = Rx.Observable.from(['3', '3', '3'])

const concatSource = baseSource1
	.concat(baseSource2, baseSource3)
	.startWith('jjj')
const concatSource1 = Rx.Observable.concat(
	concatSource,
	baseSource2,
	baseSource3,
)

const mergeSource = getIntervalSourceByTime(500)
	.take(3)
	.merge(getIntervalSourceByTime(300).take(6))

const combineLatestSource = getIntervalSourceByTime(500)
	.take(3)
	.combineLatest(getIntervalSourceByTime(300).take(6), (x, y) => {
		return `${x} + ${y}`
	})

const zipSource = getIntervalSourceByTime(500)
	.take(3)
	.zip(getIntervalSourceByTime(300).take(6), (x, y) => {
		return `${x} + ${y}`
	})
// .subscribe(baseObserver)

// zipSource.

// 每过100ms输送'h', 'e', 'l', 'l', 'o'

const helloSource = Rx.Observable.from('hello').zip(
	getIntervalSourceByTime(100),
	(x, y) => x,
)
// .subscribe(baseObserver)

const scanSource = Rx.Observable.from('hello')
	.zip(getIntervalSourceByTime(100), (x, y) => x)
	.scan((pre, cur) => {
		return pre + cur
	}, '')
// .subscribe(baseObserver)

const addBtn = Rx.Observable.fromEvent(
	document.getElementById('addBtn'),
	'click',
).mapTo(1)

const reduceBtn = Rx.Observable.fromEvent(
	document.getElementById('reduceBtn'),
	'click',
).mapTo(-1)

const state = document.getElementById('state')

const numberState = Rx.Observable.empty()
	.startWith(0)
	.merge(addBtn, reduceBtn)
	.scan((pre, next) => {
		return pre + next
	}, 0)
	.subscribe(val => {
		state.innerHTML = val
	})

// buffer

const bufferSource = getIntervalSourceByTime(300).buffer(
	getIntervalSourceByTime(1000),
)
// .subscribe(baseObserver)

// 相当于

const bufferTimeSource = getIntervalSourceByTime(300)
	.bufferTime(1000)
	.take(4)
// .subscribe(baseObserver)

const bufferCountSource = getIntervalSourceByTime(300)
	.bufferCount(5)
	.take(3)
// .subscribe(baseObserver)

const bufferBtn = document.getElementById('bufferTest')
const bufferClickSource = Rx.Observable.fromEvent(bufferBtn, 'click')

const bufferExample = bufferClickSource
	.mapTo(1)
	.bufferTime(500)
	.filter(arr => {
		return arr.length >= 2
	})
// .subscribe(baseObserver)

// distinct

const flushes = Rx.Observable.interval(1300)

const distinctSource = Rx.Observable.from([1, 2, 3, 3, 2, 1])
	.zip(getIntervalSourceByTime(300), (x, y) => x)
	.distinct(null, flushes)
// .subscribe(baseObserver)

const concatMap = Rx.Observable.fromEvent(document.body, 'click').switchMap(
	x => Rx.Observable.interval(100).take(3),
	(o, i, oI, iI) => {
		console.log(i, oI, iI, 'jjjjssss')
		return `l am ${i}`
	},
)
// .subscribe(baseObserver)

const groupSource = getIntervalSourceByTime(300)
	.take(5)
	.groupBy(x => x % 2)
// .subscribe(baseObserver)

const people = [
	{ name: 'Anna', score: 100, subject: 'English' },
	{ name: 'Anna', score: 90, subject: 'Math' },
	{ name: 'Anna', score: 96, subject: 'Chinese' },
	{ name: 'Jerry', score: 80, subject: 'English' },
	{ name: 'Jerry', score: 100, subject: 'Math' },
	{ name: 'Jerry', score: 90, subject: 'Chinese' },
]

const peopleSource = Rx.Observable.from(people)
	.zip(getIntervalSourceByTime(300), (x, y) => x)
	.groupBy(person => person.name)
	.map(group =>
		group.reduce((pre, cur) => {
			return {
				name: cur.name,
				score: pre.score + cur.score,
			}
		}),
	)
	.mergeAll()
// .subscribe(baseObserver)

const ss = Rx.Observable.from([1, 2, 3, 4])
	.filter(x => {
		console.log(x, 'filter')
		return x % 2 === 0
	})
	.map(x => {
		console.log(x, 'map')
		return x + 2
	})
// .subscribe(baseObserver)

const subSource = getIntervalSourceByTime(300).take(4)

const ob1 = {
	next(value) {
		console.log('l am 1', value)
	},
}

const ob2 = {
	next(value) {
		console.log('l am 2', value)
	},
}

// const subject = new Rx.Subject()

// // subject.subscribe(ob1)
// console.log(subject, '?????')

// subSource.subscribe(ob1)

// setTimeout(() => {
//     // subject.subscribe(ob2)
//     subSource.subscribe(ob2)
// }, 1000)

// const bhSubject = new Rx.BehaviorSubject(0)
// const bhSubject = new Rx.ReplaySubject(2)
// const bhSubject = new Rx.Subject(0)

// bhSubject.subscribe(ob1)

// bhSubject.next(1)
// bhSubject.next(2)
// bhSubject.next(3)

// bhSubject.subscribe(ob2)

// const multicastSource = getIntervalSourceByTime(200)
// 	.take(3)
    // .multicast(new Rx.Subject())

// multicastSource.subscribe(ob1)

// multicastSource.subscribe(ob2)

// multicastSource.connect()

// setTimeout(() => {
//     multicastSource.subscribe(ob2)  
// }, 300)

// const refCountSource = getIntervalSourceByTime(300).publish().refCount()

// const sub1 = refCountSource.subscribe(ob1)

// const sub2 = refCountSource.subscribe(ob2)

// setTimeout(() => {
//     sub1.unsubscribe()
// }, 3000)

// setTimeout(() => {
//     sub2.unsubscribe()
// }, 4000)