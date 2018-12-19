react 中发布订阅模式使用
=====
# 场景

怎么能将设计模式应用到我们的 React 项目中？以前一直在思考这个问题。

## 场景一

模块 A 模块 B 需要用到同一个数据 data，A 和 B 都会修改这份数据，且这两个模块会同时存在；这时我们如何做到数据公用与各个模块的更新？

方案一：  
将这份数据作为公共的数据 data，A B 模块同时使用并更改这份数据这一份数据。若使用 redux 代码可能是这样：

```javascript
// store

const store = {
	common: { data: [] },
	A: {},
	B: {},
};

// reducer
function commonReducer(state = { data: [] }, action) {
	switch (action.type) {
		case 'common_setData': {
			return {
				...state,
				data: action.data,
			};
		}
		default:
			return state;
	}
}

// connect

const actionCreator = () => {};

connect(({ A, common }) => ({ ...A, data: common.data }))(A);
connect(({ B, common }) => ({ ...A, data: common.data }))(B);

// change
// A B change调用方法；
this.props.dispatch({
	type: 'common_setData',
	data: [1, 2],
});
```

好的，第一种场景可以使用 redux 完美解决

方案二：待补充

## 场景二

A 模块使用了 data1, B 模块使用了 data2；A B 模块可以修改对应的 data；这两份 data 结构上不同，但是存在业务上的联系： 当 data1 更新后需要 data2 更新；data2 更新同样需要 data1 同步；对应后端的两个不同的 API。

我们整理一下

-   A B 使用两份存在联系的 data
-   其中一个更新需要另一个更新
-   两份 data 对应不同的 API 接口
-   A B 对应两个不同的 tab 且可能同时存在

###方案一
当其中一个数据因操作发生更新时，判断另一个模块是否存在 如果存在则调用他的数据更新逻辑；

如果你使用了 redux，可能方便一点：

```javascript
// reducerA
// 省略B
function reducerA(state = { data: [] }, action) {
    switch(action.type) {
        case 'A_setDataA': {
            return {
                ...state,
                data: action.data
            }
        }
        default: return state
    }
}

// 假设使用了thunk中间件
const queryA = () => async (dispatch, getState) => {
    const dataA = await API.queryA()
    dispatch({
        type: 'A_setDataA'
        data: dataA
    })
}

// page

class B extends React.Component {
    handleUpdateData = () => {
        // 如果 A模块存在
        const { isAExistFlag, dispatch, queryA, queryB } = props
        dispatch(queryB())
        if (isAExistFlag) {
            dispatch(queryA())
        }
    }
}

```

这样利用了 redux 可以实现功能，在模块 B 内调用模块 A 的更新逻辑；但这样逻辑就耦合了，我在模块 A 调用模块 B 方法 在模块 B 调用模块 A 的方法；但很有可能这两个模块是没有其他交互的。这违反了低耦合高内聚的原则  
而且书写 redux 的一个原则就是 不要调用（dispatch）其他模块的 action

如果你不使用 redux 如果是一个模块内调用其他模块的方法也是没有做到解耦的；那如何做到解耦尼？请看方案二

###方案二：利用事件系统

如果您的项目中没有一个全局的事件系统，可能需要引入一个；一个简单的事件系统大概是：

```javascript
class EventEmitter {
	constructor() {
		this.listeners = {};
	}

	on(type, cb, mode) {
		let cbs = this.listeners[type];
		if (!cbs) {
			cbs = [];
		}
		cbs.push(cb);
		this.listeners[type] = cbs;
		return () => {
			this.remove(type, cb);
		};
	}

	emit(type, ...args) {
		console.log(
			`%c event ${type} be triggered`,
			'color:rgb(20,150,250);font-size:14px',
		);
		const cbs = this.listeners[type];
		if (Array.isArray(cbs)) {
			for (let i = 0; i < cbs.length; i++) {
				const cb = cbs[i];
				if (typeof cb === 'function') {
					cb(...args);
				}
			}
		}
	}

	remove(type, cb) {
		if (cb) {
			let cbs = this.listeners[type];
			cbs = cbs.filter(eMap => eMap.cb !== cb);
			this.listeners[type] = cbs;
		} else {
			this.listeners[type] = null;
			delete this.listeners[type];
		}
	}
}

export default new EventEmitter();
```

这个事件系统具有注册，发布，移除事件的功能。那我们怎么在刚才这个场景去使用它尼？

1. 发布：当A模块内数据因操作发生变化时，触发该数据变化的事件，定义`type`为`data1Change`；
2. 注册：这里B模块的注册的时机，上述的场景为A和B模块可能同时出现，所以A模块存在B模块却不存在。所以这个B模块事件的监听选择在B模块组件的`componentDidMount`的时候注册，在`componentWillUnmount`时移除

大致的代码如下：

```javascript
import EventEmitter from 'eventEmitter'
class A extends React.Component {
    handleUpdateData = () => {
        // 如果 A模块存在
        const { dispatch, queryB } = props
        dispatch(queryA())
        EventEmitter.emit('data1Change')
    }
}

// B
import EventEmitter from 'eventEmitter'
class B extends React.Component {
    componentDidMount() {
        const unlistener = EventEmitter.on('data1Change', this.handleData1Change)
    }

    componentWillUnmount() {
        EventEmitter.on('data1Change', this.handleData1Change)
    }

    handleData1Change = () => {
        const { dispatch, queryB } = this.props
        dispatch(queryB())
    }
}
```
这样通过事件系统做到了两个模块之间的解耦，作为事件发布方只管发布自己的事件。两个模块在事件系统唯一的联系就是事先定义好事件的type。  

不过这也增加了几行的代码量，但相比带来的优势来说可以不计。

其他方案欢迎大家评论

## 其他场景

待大家补充
