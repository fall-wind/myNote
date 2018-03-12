## 块级作用域与函数作用域

### 函数作用域
在es5中，只有函数作用域的概念


### 块级作用域


### 变量提升和函数提升

js引擎在正式执行之前会进行一次预编译，变量声明和函数声明会被提到当前作用域的顶端；

先看个例子

```
function fun() {

    if (!foo) {
        var foo = 5;
    }

    console.log(foo);
}

fun()
```
我的第一答案是：foo is not defined

答案是 5；上面的代码相当于：

```
function fun() {
    var foo
    if (!foo) {
        foo = 5;
    }

    console.log(foo);
}

fun()
```

