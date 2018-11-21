/**
 * handler函数在新建Promise实例执行
 */
class MyPromise {
    constructor(handler) {
        this.data = null
        this.handler = handler
        this.status = null
    }

    then(resolve, reject) {
        if (this.status !== null) {
            return
        }
        this.status = 'pending'
        const resolveCb = (...args) => {
            this.status = 'resolve'
            if (typeof resolve === 'function') {
                resolve(...args)
            }
        }

        const rejectCb = (...args) => {
            this.status = 'reject'
            if (typeof reject === 'function') {
                reject(...args)
            }
        }
        try {
            this.handler(resolveCb)
        } catch (error) {
            rejectCb(error)
        }
    }
}

const p1 = new MyPromise(function(resolve, reject) {
    setTimeout(() => {
        resolve('hello promise...')
    }, 1000)
})

p1.then((result) => {
    console.error(result, 'result...')
})
