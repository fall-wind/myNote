---
title: 减少props改变
date: '2018-1-10'
spoiler: React性能优化系列（一）
---

React性能优化的一个核心点就是减少`render`的次数。如果你的组件没有做过特殊的处理（`SCU` -- `shouldComponentUpdate`），那每次父组件`render`时，子组件就会跟着一起被重新渲染。通常一个复杂的子组件都会进行一些优化，比如：`SCU` 使用`PureComponent`组件。对于`SCU`基本上进行的也都是浅比较，深比较的代价太高。

对于这些被优化的子组件，我们要减少一些不必要的props改变：比如事件绑定。对于那些依赖于配置项的组件，我们更是减少这些作为props的配置的变化，因为可能一但配置项发生了变化，整个组件都会跟着重新渲染，所以我们要尽可能的减少props的改变

## 事件绑定

```javascript
class ClickMe extends React.Component {
	state = {
		value: '3333',
	};

	render() {
		<Button
			onClick={() => {
				console.log('l am clicked!', this.state.value);
			}}
		>
			click me
		</Button>;
	}
}
```

相信大多数的开发者`React`都会指出这种写法的缺点：每次`ClickMe`组件渲染的时候`onClick`属性与上一次的值相比都是一个不同的匿名函数，如果`Button`是一个复杂的子组件且内部没有经过任何特殊的处理，那就会造成多余的渲染。对于这种情况的做法一般有两种方式：

-   在构造函数内绑定 this
-   将箭头函数赋予`class`的属性

```javascript
class ClickMe extends React.Component {
	state = {
		value: '3333',
	};

	handleClick = () => {
		console.log('l am clicked!', this.state.value);
	};

	render() {
		<Button
			onClick={() => {
				console.log('l am clicked!', this.state.value);
			}}
		>
			click me
		</Button>;
	}
}

// 或
class ClickMe extends React.Component {
	constuctor(props) {
		super(props);
		this.state = {
			value: '3333',
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		console.log('l am clicked!', this.state.value);
	}

	render() {
		<Button
			onClick={() => {
				console.log('l am clicked!', this.state.value);
			}}
		>
			click me
		</Button>;
	}
}
```

## 批量事件绑定

那在考虑下面这种情况，涉及到子组件的批量绑定时：

```javascript
class MultiClick extends React.Component {
	dataSource = [
		{ key: '1', value: '1' },
		{ key: '2', value: '2' },
		{ key: '3', value: '3' },
		{ key: '4', value: '4' },
	];

	handleClick = key => {
		console.error('key:', key);
	};

	render() {
		return (
			<div>
				{this.dataSource.map(item => (
					<div
						key={item.key}
						onClick={() => {
							this.handleClick(item.key);
						}}
					>
						{item.value}
					</div>
				))}
			</div>
		);
	}
}
```

类似于这种需要传递参数的情况，该如何去优化？

这个就需要我们去做数据的缓存，即回调的缓存，上述例子如下：

```javascript
cacheMap = {};

genClickHandler = key => {
	if (!this.cacheMap[key]) {
		this.cacheMap[key] = () => {
			console.error('key:', key);
		};
	}
	return this.cacheMap[key];
};

// 绑定
<div key={item.key} onClick={this.genClickHandler(item.key)}>
	{item.value}
</div>;
```

如果多个基本类型的参数可以，将他们拼接成字符串作为`cacheMap`的`key`，简单的引用类型可以使用`JSON.stringify`，不过原则上作为事件绑定的函数  传递的参数简单为好。

## 作为配置的props缓存

说到数据的缓存，不管光是事件的回调，还有很多  其他情况。比如表格的 `columns`需要根据属性变化的这种场景：

```javascript
class TableDemo extends React.Component {
	getColumns = () => {
		const { name } = this.state;
		return [
			{
				key: '1',
				title: `${name}_1`,
			},
			{
				key: '2',
				title: `${name}_2`,
			},
		];
	};

	render() {
		const { dataSource } = this.props;
		return <Table dataSource={dataSource} columns={this.getColumns()} />;
	}
}
```

这种情况每次组件`render`的时候，`getColumns`都会被调用一次，而这个函数每次的返回值都是不一样的 ，及时这两次的`name`值都相等，原因大家可以类比`[] !== []`这里就不过多叙述了。

有一种做法是，将`columns`作为一个`this.state`的一个属性，在初始化和每次 `this.state.name`改变的时候同步改变`this.state.columns`的值，但如果有多个  类似于`this.state.name`的变量控制`this.state.columns`的值时候，发现每个变量变化的时候都要调用生成`columns`的方法， 十分的烦琐易造成错误。

使用缓存可以很好的解决这个问题，在参数较为复杂的时候，我们选择只缓存上一次的值。先看代码再说：

首先我们写一个缓存的函数

```JavaScript
function cacheFun(cb) {
    let preResult = null
    let preParams = null
    const equalCb = cb || shallowEqual
    return (fun, params) => {
        if (preResult && equalCb(preParams, params)) {
            return preResult
        }
        preResult = fun(params)
        preParams = params
        return preResult
    }
}
```

这个缓存函数是一个闭包函数，保存了上一次的参数和上一次的结果，主要的实现就是比较两次的参数，相同则返回上一次结果，不同则返回  调用函数的新结果。当然  对于某些特殊的情况只需要根据传入特定的某几个参数做出判断，这种情况你可以传入自定义的比较函数。先看一下上面的实现：

`cacheFun`函数第一个参数为选填的选项，是你比较两次参数的  方法，如果你不传入则仅进行  浅比较（与 React 的浅比较相似）。

返回函数的第一个参数为你的  生成`columns`的回调，`params` 为你需要的  变量，如果你的变量比较多，你可以将他们  作为一个对象传入；那么代码就类似如下：

```javascript
const params = { name, time, handler };
cacheFun(this.getColumns, params, cb);
```

在类中的使用为：

```javascript
class TableDemo extends React.Component {
	getColumns = name => {
		return [
			{
				key: '1',
				title: `${name}_1`,
			},
			{
				key: '2',
				title: `${name}_2`,
			},
		];
	};

	getColumnsWrapper = () => {
		const { name } = this.state;
		return cacheFun()(this.getColumns, name);
	};

	render() {
		const { dataSource } = this.props;
		return (
			<Table dataSource={dataSource} columns={this.getColumnsWrapper()} />
		);
	}
}
```

假如你不喜欢对象的传值方式，那你可以  对这个缓存函数进行更改：

```javascript
function cacheFun(cb) {
	let preResult = null;
	let preParams = null;
	const equalCb = cb || shallowEqual;
	return (fun, ...params) => {
		if (preResult) {
			const isEqual = params.ervey((param, i) => {
				const preParam = preParams && preParams[i];
				return equalCb(param, preParam);
			});
			if (isEqual) {
				return preResult;
			}
		}
		preResult = fun(params);
		preParams = params;
		return preResult;
	};
}
```

你这可以这样使用：

```javascript
cacheFun()(this.getColumns, name, key, param1, params2);
// 或者
cacheFun()(this.getColumns, name, key, { param1, params2 });
```
这样配置也就被缓存优化了，当`TableDemo`组件因非`name`属性`render`时，这时候你的`columns`还是返回上一次缓存的值，是的`Table`这个组件减少了一次因`columns`引用不同产生的`render`。如果`Table`的`dataSource`数据量很大，那这次对应用的优化就很可观了。

## 数据的缓存

数据的缓存在原生的内部也有使用`cacheFun`的场景，如对于一个`list` 根据 `searchStr`模糊过滤对于的`subList`。

大致代码如下：
```javascript
class SearchList extends React.Component {
    
    state = {
        list: [
            { value: '1', key: '1' },
            { value: '11', key: '11' },
            { value: '111', key: '111' },
            { value: '2', key: '2' },
            { value: '22', key: '22' },
            { value: '222', key: '222' },
            { value: '2222', key: '2222' },
        ],
        searchStr: '',
    }

    // ...

    render() {
        const { searchStr, list } = this.state
        const dataSource = list.filter(it => it.indexOf(searchStr) > -1)
        return (
            <div>
                <Input onChange={this.handleChange} />
                <List dataSource={dataSource} />
            </div>
        )
    }
}
```

对于此情景的优化使用`cacheFun`也可以实现

```javascript
const dataSource = cacheFun()((plist, pSearchStr) => {
    return plist.filter(it => it.indexOf(pSearchStr) > -1)
}, list, searchStr)
```

但是有大量的类似于此的衍生值的时候，这样的写法又显得不够。社区上出现了许多框架如配合`react-redux`使用[reselect](https://github.com/reduxjs/reselect)（当然也可以单独使用，不过配合redux使用简直就是前端数据管理的一大杀手锏），还有[mobx](https://github.com/mobxjs/mobx)的衍生概念等。这些后续会单独介绍，这里就稍微提一下。

