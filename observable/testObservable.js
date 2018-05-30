class Subscription {
	constructor(next, error, complete) {
		this._isStopped = false
		this._next = next
		this._error = error
		this._complete = complete
	}

	next(value) {
		if (!this._isStopped) {
			this._next(value)
		}
	}

	error(value) {
		if (!this._isStopped) {
			this._isStopped = true
			this._error(value)
			this.unsubscribe()
		}
	}
	complete(value) {
		if (!this._isStopped) {
			this._isStopped = true
			this._complete(value)
			this.unsubscribe()
		}
	}
	unsubscribe() {
		this._isStopped = true
	}
}

class Observable {
	constructor(_subscribe) {
		this._subscribe = _subscribe
	}

	static create(_subscribe) {
		return new Observable(_subscribe)
	}

	subscribe({ next, error, complete }) {
		const sink = new Subscription(next, error, complete)
		this._subscribe(sink)
		return sink
	}
}

const observable = Observable.create(observer => {
	observer.next(1)
	observer.next(2)
	setTimeout(() => {
		observer.next(3)
		observer.complete()
	}, 1000)
})

const observer = {
	next: x => console.log('got value ' + x),
	error: err => console.error('something wrong occurred: ' + err),
	complete: () => console.log('done'),
}

console.log('just before subscribe')
const subscription = observable.subscribe(observer)
console.log('just after subscribe')
