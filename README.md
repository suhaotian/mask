# mask.js
![Travis branch](https://img.shields.io/travis/joyent/node/v0.6.svg) ![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg?style=flat) ![apm](https://img.shields.io/apm/l/vim-mode.svg?style=flat)

mask.js是一个基于canvas的移动端刮刮卡插件，支持图片和颜色两种填充方式，同时提供自动消抹，自定义涂抹笔触等功能。


## 快速使用
使用之前必须先引用这个脚本 然后
```javascript
new mask(target,config);
```
- target：要初始化成刮刮卡的目标canvas元素，不可为空 <br />
- config：配置对象【config可以为空 为空的话使用默认值】

```javascript
new mask(document.querySelector("canvas"),{
	fillStyle: "image",
	fillContent: "./img/mask.jpg",
	percent: "50",
	radius: "30",
	disable: false,
	touchstart: function(e) {
		console.log("手指按下");
		console.log(e);
	},
	touchmove: function(e) {
		console.log("手指移动");
		console.log(e);
	},
	touchend: function(e) {
		console.log("手指离开");
		console.log(e);
	},
	complete: function() {
		console.log("刮完了");
	},
	inited: function() {
		console.log("mask初始化完成");
	}
});
```


**其他拓展功能请参考[【DEMO】](index.html)**

## API

### 自定义配置config
参数|说明|默认值
---|---|---
fillStyle|填充的方式 支持两种 color & image|color
fillContent|根据fillStyle填充内容<br>fillStyle=color则填颜色值<br>fillStyle=image则填图片地址或base64代码|\#cccccc
percent|涂抹了xx%后自动抹去 【接受0%-100%之间的数值 百分号%可省略】|100
radius|涂抹笔触的半径【单位是px px可省略】|15
disable|是否封锁 默认不封锁|false
touchstart|手指按下的时候执行函数|function(){}
touchmove|手指移动的时候执行函数|function(){}
touchend|手指离开的时候执行函数|function(){}
complete|刮完时【刮到指定百分比之后】执行函数|function(){}
inited|函数初始化之后执行函数|function(){}

### 函数方法

- clear() 自动刮完
- disable() 封锁刮刮卡
- enable() 解锁刮刮卡
- changeConfig(config) 更改配置项【传入自定义config对象 实时生效】【亦可实现disable()和enable()功能】
- init() 重新初始化【可配合changeConfig(config)使用】

## 常见问题
### 注意fillContent图片跨域
因为canvas中的getImageData方法不支持跨域，所以当参数fillStyle=image时，fillContent填的图片地址必须与主文件同域，否则程序会把自动涂抹功能改为刮了【percent/10】次之后自动抹去。

如果图片不得不跨域，则考虑以下两种解决方案
- 通过一个自定义接口，把图片转换成base64编码后再引用
- 从网络层面设置图片服务器的响应头 Access-Control-Allow-Origin:*