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

    then(fun) {

    }
}