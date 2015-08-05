# mask.js
![Travis branch](https://img.shields.io/travis/joyent/node/v0.6.svg) ![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg?style=flat) ![apm](https://img.shields.io/apm/l/vim-mode.svg?style=flat)

mask.js是一个基于canvas的移动端刮刮卡插件，支持图片和颜色两种填充方式，同时提供自动消抹，自定义涂抹笔触等功能。

## 快速使用
```javascript
new mask({
	target: document.querySelector("canvas")
});
```
**【其他拓展功能请参考DEMO】**


## API
参数|说明|默认值
---|---|---
target|canvas目标元素 【必须】 没有的话返回false|false
fillStyle|填充的方式 支持两种 color & image|color
fillContent|根据fillStyle填充内容<br>fillStyle=color则填颜色值<br>fillStyle=image则填图片地址或base64代码|\#cccccc
percent|涂抹了xx%后自动抹去 【接受0-100之间的数值】|100
radius|涂抹笔触的半径|15
touchstart|手指按下的时候执行函数|function(){}
touchmove|手指移动的时候执行函数|function(){}
touchend|手指离开的时候执行函数|function(){}
complete|刮完时【刮到指定百分比之后】执行函数|function(){}
inited|函数初始化之后执行函数|function(){}

## 常见问题
### 注意fillContent图片跨域
因为canvas中的getImageData方法不支持跨域，所以当参数fillStyle=image时，fillContent填的图片地址必须与主文件同域，否则程序会把自动涂抹功能改为刮了【percent/10】次之后自动抹去。

如果图片不得不跨域，则考虑以下两种解决方案
- 通过一个自定义接口，把图片转换成base64编码后再引用
- 从网络层面设置图片服务器的响应头 Access-Control-Allow-Origin:*