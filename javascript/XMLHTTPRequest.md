## XMLHttpRequest

- 创建一个XMLHttpRequest对象
- 打开与服务器的连接
- 发送数据
- 监听状态的变化

监听 XMLHttpRequest的readyState的变化

### readyState

共有五个值：```[0,1,2,3,4]```  

简单理解为：```['正在初始化', '初始化请求成功， 发送请求','接收数据','解析数据','接受']```

0： 创建XMLHttpRequest对象并调用，open()方法


### status

即为我们平时所说的状态码

### 简单代码

```
function ajax(Url,sccuessFn,failureFn) {
    let xhr = null
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    }else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xhr = open('get',Url,true);
    //3.发送给服务器
    xhr = send(null);
    //4.响应就绪
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                successFn(xhr.responseText);
            }else {
                if(failureFn) {
                    failureFn();
                }else {
                    alert(xhr.status);
                }
            }
        }
    }
}
```

