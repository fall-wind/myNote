## 批量更新

情景，在一个方法中调用多次setState，如：

```
handleClick = () => {
    // currentState: {a: false, b: false}
    this.setState({a: true})
    this.setState({b: true})
}

```

这两个setState的过程中不会出现```{a: false, b: true}```这种情况的

作用：减少渲染的次数；当然开发者不了解这种批量更新 也会出现代码没达到预期的情况


## 资料

- [深入理解 React 的 batchUpdate 机制](http://undefinedblog.com/understand-react-batch-update/)
