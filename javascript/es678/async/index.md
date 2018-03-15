## 是什么

async 函数是什么？一句话，它就是 Generator 函数的语法糖

每个async函数返回一个Promise函数 这样就可以调用then函数  
比Generator方便很多

进一步说，async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，  
而await命令就是内部then命令的语法糖

## 怎么用

- 函数声明
- 赋值变量
- 对象的属性
- Class内部方法

## 错误处理机制
如果await后面的异步操作出错，那么等同于async函数返回的 Promise 对象被reject  

为了防止出错 将代码放在try...catch代码块之中

## tips

await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中  

如果存在多个await 并且他们不存在继发关系，最好让他们同时触发

```
async function ww(params) {
    const [a, b] = await Promise.all([p1('hello'), p1('world')])
    console.log(a, b)

    const p11 = p1('hi')
    const p22 = p1('ni hao')

    const aa = await p11
    console.log(aa)
    const bb = await p22
    console.log(bb)

    const aaa = await p1('g')
    console.log(aaa)
    const bbb = await p1('g')
    console.log(bbb)
}

ww()
```

使用for循环进行遍历await操作

## 阅读链接

- [async](http://es6.ruanyifeng.com/#docs/async)