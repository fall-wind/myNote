## 浏览器加载解析渲染过程

### 解析

浏览器会解析：

- HTML/XHTML/SVG，解析这三种文件会生成一个DOM Tree
- CSS 解析css生成css规则树
- js脚本，主要是通过 DOM API 和 CSSOM API 来操作 DOM Tree 和 CSS Rule Tree.

### 渲染


### Rendering Tree和DOM树

这两者不是一个东西，DOM树根据html构建，但向header、display: none的DOM元素就没有必要放在渲染树之中了

## reflow

reflow 会从```<html>```这个root frame开始递归往下，依次计算所有的结点几何尺寸和位置

引起reflow的原因： 

- 

## repaint

