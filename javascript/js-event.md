## 事件委托

事件委托也称为事件代理


### 应用场景

假设有一个```ul```包含100```li```,每个li都有相同的click事件  
如果我们使用for循环来为li添加事件，这对性能影响很大 原因：

- 这就会使页面上的事件处理程序增加几个数量级
- 每个函数都是一个对象，而对象就会占用内存

这个时候就应将事件委托到它的父级

```
window.onload = function(){
　　var oUl = document.getElementById("ul1");
　　oUl.onclick = function(ev){
　　　　var ev = ev || window.event;
　　　　var target = ev.target || ev.srcElement;
　　　　if(target.nodeName.toLowerCase() == 'li'){
　 　　　　　　alert(123);
            alert(target.innerHTML);
　　　　}
　　}
}
```
