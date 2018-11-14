# React 性能优化

## 前置

- 父组件被更新了 子组件的更新情况：component、 pureComponent、纯函数组件
- 父组件SCU返回false组件的子组件是否会被更新

## 常用的优化手段

### 使用 PureComponent 代替 Component
```javaScript
if (type.prototype && type.prototype.isPureReactComponent) {
  return (
    !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
  );
}
```

问：是否所有情况下PureComponent都比Component有效率？

### 使用纯函数组件代替 Class组件

函数式组件中并不需要进行生命周期的管理与状态管理，因此React并不需要进行某些特定的检查或者内存分配，从而保证了更好地性能表现

在什么情况下 Component组件比函数组件更有优势？

### 使用 SCU： shouldComponentUpdate

一个可编辑表格，代码可能是这样的：  

TCell组件

``` javascript
function TCell({ handleRowChange, rowKey, cellKey }) {
    // 每次渲染 onChange都是一个新的函数
    function onChange(e) {
        handleRowChange(rowKey, { cellKey: e.target.value })
    }
    return <Input onChange={onChange} />
}

function OtherCell() {
    // ...
}
```

TRow
```javascript
function shallowEqual(newProps, oldProps) {

}

function getRowData(dataSource, rowKey) {
    return dataSource.map(it => it.rowKey === rowKey)
}

class TRow extends React.Component {
    shouldComponentUpdate(nextProps) {
        // 1.
        if (nextProps.rowData !== this.props.rowData) {
            return false
        }

        // 2. 将整个dataSource传入
        if (!shallowEqual(getRowData(nextProps), getRowData(this.props))) {
            return false
        }
        return true
    }

    render() {
        return columns.map(it => <TCell {...someProps} {...someFun} />)
    }
}
```

Table组件：
```javascript
class Table extends React.PureComponent {
    handleRowChange = (rowKey, partRecord) => {
        const { rowKey, dataSource = [], onChange } = this.props
        const newData = dataSource.map(it => {
            if (rowKey === it.rowKey) {
                return {
                    ...it,
                    ...partRecord,
                }
            }
            return it
        })
        onChange(newData)
    }

    render() {
        const { dataSource = [], columns = [] } = this.props
        return (
            <div className="table-warp">
                <THead />
                <div className="tbody-warp">
                    {
                        dataSource.map(data => (
                            <TRow {...someProps} {...someFun} />
                        ))
                    }
                </div>
            </div>
        )
    }
}

```

有两种场景存在：  

- 行与行之间没有关联关系
- 行与行之间存在关系，比如：下一条的数据的默认值 根据上一条的数据生成等

针对于第二种场景如果选择将整个dataSource向下传递，如前所述的SCU返回不渲染 它的子组件的Props并没有更新；比如你在第一行编辑时 第二行的Tbody的dataSource更新了 但因为SCU返回false，不调用render方法 所以它自组件的props就不会发生变化 所以你在第二行编辑的第一次取到的值还是旧的 一次更新之后才会取到最新的




采用的方法为： 改写<code>handleChangeRow</code>


```javascript
handleRowChange = (rowKey, partRecord) => {
    const { rowKey, dataSource = [], onChange } = this.props
    const newData = dataSource.map(it => {
        if (rowKey === it.rowKey) {
            let usedPartRecord = partRecord
            if (type partRecord === 'function' ) {
                usedPartRecord = partRecord({ dataSource })
            }
            return {
                ...it,
                ...usedPartRecord,
            }
        }
        return it
    })
    onChange(newData)
}
```

对于复杂的表格编辑存在

使用结构赋值造成不必要的props被传递，被重新渲染

## 对于大列表

- 懒渲染：就是常见的无限滚动
- 可视区域渲染： 只渲染可见部分，不可见部分不渲染

### 实现一个虚拟列表

- 计算当前可见区域起始数据的 startIndex
- 计算当前可见区域结束数据的 stopIndex
- 计算当前可见区域的数据，并渲染到页面中
- 计算 startIndex 对应的数据在整个列表中的偏移位置 startOffset，并设置到列表上
- 在滚动的时候，修改真实显示区域的 transform: translate3d(0, y, 0)

### 成熟的虚拟列表组件库

- [react-virtualized](https://github.com/bvaughn/react-virtualized.git)
- [react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list.git)