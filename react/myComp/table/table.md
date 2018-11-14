# table 组件
项目中需要封装一个table组件 中间遇到了不少问题  
API 为了兼容antd 的表格组件 基本结构是columns + dataSource

## 宽度计算

问题描述：根据columns的width 和 styles选项去计算每一列的宽度和总宽度

有一个初始的宽度计算