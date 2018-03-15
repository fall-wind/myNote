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
