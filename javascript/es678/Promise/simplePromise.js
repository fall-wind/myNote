class SPromise {
    constructor(executor) {
        this.status = 'pending'
        this.data = undefined
        this.onResolvedCallback = []
        this.onRejectedCallback = []
        function resolve(value) {
            if (this.status === 'pending') {
                this.status = 'resolved'
                this.data = value
                this.onResolvedCallback.forEach(fun => {
                    fun(value)
                })
            }
        }
        function reject(e) {
            if (this.status === 'pending') {
                this.status = 'reject'
                this.data = e
                this.onResolvedCallback.forEach(fun => {
                    fun(e)
                })
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(e)
        }
    }

    then(onResolved, onRejected) {
        const self = this
        if (this.status === 'resolved') {
            return new Promise(function(resolve, reject) {

            })
        }

        if (this.status === 'rejected') {
            return new Promise(function(resolve, reject) {

            })
        }

        if (this.status === 'pending') {
            return new Promise(function(resolve, reject) {

            })
        }
    }
}

const PENDING = "pending"
const RESOLVED = "resolved"
const REJECTED = "rejected"

class LPromise {
    constructor(handler) {
        this.status = PENDING
        this.next = []
        const self = this

        
    }
    
    then(rejectCallback) {

    }
}