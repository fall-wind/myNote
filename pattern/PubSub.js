class PubSub {
	constructor() {
		this.handler = {}
	}

	on(type, fn) {
		if (this.handler[type]) {
			this.handler[type].push(fn)
		} else {
			this.handler[type] = [fn]
		}
	}

	emit(type) {
		(this.handler[type] || []).forEach(fn => fn())
	}

	off(type, fn) {
        if ((this.handler[type] || []).length > 0) {
			this.handler[type] = this.handler[type].filter(
				handler => handler === fn,
			)
		} else {
            throw new Error('没有注册对应的事件')
        }
    }
}

const p1 = new PubSub()

const cb1 = () => {
    console.log('hello1')
}

const cb2 = () => {
    console.log('hello2')
}

p1.on('hello', cb1)
p1.on('hello', cb2)

p1.emit('hello')
