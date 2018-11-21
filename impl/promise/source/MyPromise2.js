const PENDING_STATUS = 'pending';
const REJECT_STATUS = 'rejected';
const RESOLVE_STATUS = 'resolved';

class MyPromise {
	constructor(handler) {
		this.status = PENDING_STATUS;
		this.data = null;
		this.resolveCbs = [];
		this.rejectCbs = [];

		try {
			handler(this.resolve.bind(this), this.reject.bind(this));
		} catch (error) {
			this.reject(error);
		}
	}

	then(resolve, reject) {
		console.error(this.status, 'status...');
		if (this.status === PENDING_STATUS) {
			if (typeof resolve === 'function') {
				this.resolveCbs.push(resolve);
			}
			if (typeof reject === 'function') {
				this.rejectCbs.push(reject);
			}
		} else if (this.status === REJECT_STATUS) {
			reject(this.error);
		} else if (this.status === RESOLVE_STATUS) {
			resolve(this.data);
		}
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
	console.error(111);
	// resolve('22222')
	reject('error');
}).then(
	result => {
		console.error(result, '32222');
	},
	error => {
		console.error(error, 'error...');
	},
);
