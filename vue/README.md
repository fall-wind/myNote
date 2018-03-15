## 简单学习Vue

### 计算属性和监听器

#### 计算属性

```
var vm = new Vue({
    el: '#demo',
    data: {
        a: 3,
        b: 9,
    },
    compute: {
        sum: function() {
            return this.a + this.b
        }
    }
})
```

这样就不需要为a, b 添加watch函数

也可以为其提供一个setter属性

```
var vm = new Vue({
    el: '#demo',
    data: {
        a: 3,
        b: 9,
    },
    compute: {
        sum: {
            get: function() {
                return this.a + this.b
            },
            set: function(val) {
                this.a = 3
                this.b = val - 3
            }
        }
    }
})
```

#### 监听器

简单理解为onChange方法

```
new Vue({

})
```

### class与style

这里指的是为元素添加类名

#### 绑定类名

- 对象语法
- 数组语法
- 在组件中添加的类名一直存在

#### 添加style

为元素添加行内样式

- 对象语法
- 数组语法


### 条件渲染

使用```v-if```指令

切换多个的visible， 使用template元素

```v-else```、```v-else-if```必须跟在带有```v-if```元素的后面；  
否则vue识别不出

```v-show```指令；紧紧是切换display属性

### 列表渲染

```v-for```指令 使用 ```item in items```

例子： 

```
new Vue({
    el: '#forDemo',
    data: {
        list: [
            {
                name: 'yt',
                age: '25',
            },
            {
                name: 'yt1',
                age: '25',
            },
        ]
    }
})

// temp

<ol>
    <li v-for="(item, index) in list">
        {{ item.name }} - {{ item.age }} - {{ index }}
    </li>
</ol>
```

遍历对象： 

```
new Vue({
    el: '#objItem',
    data: {
        obj: {
            name: 'ss',
            age: '18',
        }
    }
})

<ol>
    <li v-for="(key, value, index) in obj" key="item.key">
        {{ key }} - {{ value }} - {{ index }}
    </li>
</ol>

```

数组的更新检测  

不同于react， React不建议你去直接修改你state的数组或对象，因为这不会触发它的更新；  
它要求使用```this.setState(obj)```去更新你的状态  

而vue直接更改数组 也会去改变视图；  
当然你也可以去返回一个新的数组，vue也做了优化 他也会去重用旧的dom元素

vue不能检测出一下变动的数组

- 当你利用索引直接设置一个项时，例如：```vm.items[indexOfItem] = newValue```
- 当你修改数组的长度时，例如：```vm.items.length = newLength```

未解决上述1问题

Vue提供了一个办法：

```
Vue.set(vm.items, indexOfItem, newValue)
```

对于对象，同样的是Vue 不能动态添加根级别的响应式属性。但是，可以使用 Vue.set(object, key, value) 方法向嵌套对象添加响应式属性

对数组的过滤操作等：  

```
new Vue({
    el: '#demo',
    data: {
        numbers: [1,2,3,4,5]
    },
    methods: {
        even: function(numbers) {
            return numbers.filter(item => item % 2 === 0)
        }
    }
})

// tmp

<ol>
    <li v-for="item in even(numbers)">
        {{ item }}
    </li>
</ol>
```

v-for on a ```<template>```

```
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider"></li>
  </template>
</ul>
```

v-for指令的优先级高于v-if

```
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo }}
</li>
```

自定义组件的v-for

```
<my-component v-for="item in items" :key="item.id"></my-component>
```

```
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```
