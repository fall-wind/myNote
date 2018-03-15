## 用法

一下打印

```
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
```

调用resolve(1)以后，后面的console.log(2)还是会执行，并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务

### Promise.all()


### Promise.resolve()
```
setTimeout(function() {
	console.log('three')
}, 0)

Promise.resolve().then(function(result) {
	console.log('two')
})

console.log('one')
```


## 缺点

### promise会吃掉错误


