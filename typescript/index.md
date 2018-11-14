# TypeScript

## 为什么使用TS

- TypeScript设计了一套类型机制来保证编译时的强类型判断
- 配合vs code的强大提示

### 静态与动态诶性语言

静态语言： 类型检测在运行前进行（如编译阶段）
动态语言： 类型检测在运行时

TypeScript 的定位是静态类型语言，而非类型检查器


### 简单的例子

``` typescript
let a: string
a = 11 // Cannot convert 'number' to string
```

## 接口 

### 动态属性名

## 类


## 函数

### 函数重载
同一范围中声明几个功能类似的同名函数，但是这些同名函数的形式参数（指参数的个数、类型或者顺序）必须不同 常用来实现功能类似 所处理的数据类型不同的问题 重载函数返回的类型也可以不同

## 泛型
在定义变量的时候不确定变量的类型

``` typescript
function identity(arg: any): any {
    return arg
}

function identity<T>(arg: T): T {
    return arg;
}

// 使用

// 传入所有的参数，包含类型参数：
const result = identity<number>(111)
// 类型推论 -- 即编译器会根据传入的参数自动地帮助我们确定T的类型
const result = identity('1111')

```

## 类型推论

``` typescript
let a = 111
a = '111' // Type '"111"' is not assignable to type 'number'
```

## 类型断言

``` typescript
function getLength(something: string | number): number {
    if (something.length) {
        return something.length;
    } else {
        return something.toString().length;
    }
}

function getLength(something: string | number): number {
    if ((<string>something).length) {
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}
```

## 枚举

``` typescript
// 数字枚举
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}

// 字符串枚举
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

Up初始化为1，其他的会累加1 自动增长

## 命名空间
为防止类型重复，使用 namespace 用于划分区域块，分离重复的类型，顶层的 namespace 需要 declare 输出到外部环境，子命名空间不需要 declare。

``` typescript
namespace Letter {
  export let a = 1;
  export let b = 2;
  export let c = 3;
  // ...
  export let z = 26;
}
```

====>

```
var Letter;
(function (Letter) {
    Letter.a = 1;
    Letter.b = 2;
    Letter.c = 3;
    // ...
    Letter.z = 26;
})(Letter || (Letter = {}));
```

## 声明文件

只包含了类或函数的签名，而没有实际内容，用于编辑器提示和验证

## [JSX](https://www.tslang.cn/docs/handbook/jsx.html)

### SFC
无状态函数组件

``` typescript
interface ClickableProps {
    children: JSX.Element[] || JSX.Element
}

interface HomeProps extends ClickableProps {
    home: JSX.Element
}

interface SideProps extends ClickableProps {
    side: JSX.Element | string;
}

function MainButton(props: HomeProps): JSX.Element;
function MainButton(props: SideProps): JSX.Element {
    // ....
}

```

### 类组件

``` typescript  
interface Props {
    foo: string
}

class MyComponent extends React.Component<Props, {}> {
    render() {
        return <div>{this.props.foo}</div>
    }
}


```
types 还是 interfaces？
- 当允许库或第三方开发者定义类型时，要给这些公共的 API 定义使用 interface。
- 考虑为 React 组件的 Props 和 State 使用 type ，因为它有更多的限制

## 在项目中使用typescript
[官方文档](https://www.tslang.cn/docs/handbook/react-&-webpack.html)

主要在已有项目中

安装依赖 以及声明

配置webpack 添加loader， tsconfig.json

出现不热更新的问题：安装loader配置webpack

[react起步](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter)

## issue

### 在typeScript文件中引入JavaScript文件

为js文件编写声明文件（以.d.ts结尾的文件）

### 在typeScript文件中引入图片
使用require 原因：

### react中的各种type

e:


## 阅读链接
- [https://github.com/fi3ework/blog/issues/22](https://github.com/fi3ework/blog/issues/22)
- [playground](http://www.typescriptlang.org/play/index.html)
- [https://ts.xcatliu.com/basics/declaration-files.html](https://ts.xcatliu.com/basics/declaration-files.html)