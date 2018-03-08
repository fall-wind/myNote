## 简介
react大于版本16.3.0都会支持新的contextAPI  
这个全新的context API与createElement一样是顶层的API

新的API还解决了旧API的一个bug：  
在context更新了之后向下传递的过程中，当一个组件的shouldComponentUpdate返回false时，下层的组件对应的context就不会更新

## 用法

```
import React from 'react'

const TestContext = React.createContext()

class TestContextProvider extends React.Component {
	state = {
		color: 'red',
	}

	handleChangeColor = color => {
		this.setState({
			color,
		})
	}

	render() {
		const { color } = this.state
		return (
			<TestContext.Provider
				value={{ color, handleChangeColor: this.handleChangeColor }}
			>
				{this.props.children}
			</TestContext.Provider>
		)
	}
}
```
由顶层API createContext创建的context对象为

```
  const context: ReactContext<T> = {
    $$typeof: REACT_CONTEXT_TYPE,
    calculateChangedBits,
    defaultValue,
    currentValue: defaultValue,
    changedBits: 0,
    // These are circular
    Provider: (null: any),
    Consumer: (null: any),
  };
```

Provider位于Consumer的上层； 与旧的API类似的是；在Provider包裹内可以通过Consumer获得context

Consumer：Consumer的children是一个回调函数；参数则是在Provider传入的value；


```
function SubTest(context) {
	// console.error(context, '???', handleChangeColor)
	return (
		<div>
			<div style={{ color: context.color }}>
				{`my color is ${context.color}`}
			</div>
			{['blue', 'black', 'red'].map(color => {
				return (
					<button
						key={color}
						onClick={() => {
							context.handleChangeColor(color)
						}}
					>
						{`change color to ${color}`}
					</button>
				)
            })}
            <TestContext.Consumer>{context => (<div>{context.color}</div>)}</TestContext.Consumer>
		</div>
	)
}
```

```
class Test extends React.Component {
	render() {
		return (
			<TestContextProvider>
				<TestContext.Consumer>
					{context => <SubTest {...context} />}
				</TestContext.Consumer>
			</TestContextProvider>
		)
	}
}

```

