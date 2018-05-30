webapck4.0

## 遇到的坑


写法： 

```
class A {
    state = {}
}
```

报错，这是因为少了个插件[transform-class-properties](http://babeljs.io/docs/plugins/transform-class-properties/)