第一次渲染
========

# 前置

## 几个重要的概念

- fiber
- effect
- updateQueue
- expirationTime
- work: beginWork commitWork

# 大致步骤

先以生命周期分为几个阶段：componentWillMount、 render、componentDidMount、componentDidUpdate

ReactDOM.render 传入参数 