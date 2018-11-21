const PENDING_STATUS = 'pending';
const REJECT_STATUS = 'rejected';
const RESOLVE_STATUS = 'resolved';

/**
 * 添加链式调用
 */
class MyPromise {
	constructor(handler) {
		this.status = PENDING_STATUS;
		this.data = null;
		this.resolveCbs = [];
        this.rejectCbs = [];
        // console.error('????XXXXX', handler, '>>>>XXXX')
		try {
			handler(this.resolve.bind(this), this.reject.bind(this));
		} catch (error) {
            console.error(error, 'XXXX')
			this.reject(error);
		}
	}

	/**
	 * 1. 有返回值
	 * @param {*} resolve
	 * @param {*} reject
	 */
	then(resolve, reject) {
        const { status, data, error } = this
		return new MyPromise(function(nextResolve, nextReject) {
			// console.error(status, 'XXXXX');
			function useResolve(result) {
				if (typeof resolve === 'function') {
                    const res = resolve(result);
                    console.error(res, 'res....')
					if (res instanceof MyPromise) {
						res.then(nextResolve, nextReject);
					} else {
						nextResolve(result);
					}
				}
			}

			function useReject(error) {
				if (typeof reject === 'function') {
					reject(error);
				} else if (typeof nextResolve === 'function') {
					nextReject(error);
				}
			}

			if (status === PENDING_STATUS) {
				resolveCbs.push(useResolve);
				rejectCbs.push(useReject);
			} else if (status === REJECT_STATUS) {
				useReject(error);
				// if (typeof reject === 'function') {
				//     reject(this.error);
				// }
			} else if (status === RESOLVE_STATUS) {
				useResolve(data);
				// if (typeof resolve === 'function') {
				//     resolve(this.data);
				// }
			}
		});
	}

	resolve(result) {
		this.status = RESOLVE_STATUS;
		this.data = result;
		if (this.resolveCbs.length > 0) {
			this.resolveCbs.forEach(cb => {
				cb(result);
			});
		}
	}

	reject(error) {
		this.status = REJECT_STATUS;
		this.error = error;
		if (this.rejectCbs.length > 0) {
			this.rejectCbs.forEach(cb => {
				cb(error);
			});
		}
	}
}

const p1 = new MyPromise(function(resolve, reject) {
	console.error(111111);
	// resolve('22222')
	resolve('error');
}).then(result => {
    console.error(result, 222222);
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve('set time out...')
        }, 1000)
    })
}).then(result => {
    console.error(result, 'final result...')
});
