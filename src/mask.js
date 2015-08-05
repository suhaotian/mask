;(function(win, doc) {
	if (win.mask) {
		return
	};

	function mask(config) {
		this.config = this._extend(config, mask.config, false);
		if (!this.config.target) {
			return false;
		};
		this._init();
	}

	// 默认配置
	mask.config = {
		target: false, //覆盖的目标 没有的话不执行接下来的操作
		fillStyle: "color", //填充的方式 支持两种 color & image
		fillContent: "#cccccc", //填充的内容 根据fillStyle 如果fillStyle=color则填颜色 fillStyle=image则填图片地址或base64
		percent: "100", //
		radius: "15", //涂抹笔触的半径 默认15
		touchstart: function() {}, //手指按下的时候执行
		touchmove: function() {}, //手指移动的时候执行
		touchend: function() {}, //手指离开的时候执行
		complete: function() {}, //刮到指定百分比之后执行
		inited: function() {} //初始化之后执行
	};

	mask.prototype = {
		_init: function() {
			var self = this;
			var c = self.config;

			var Jcanvas = c.target;
			var ctx = Jcanvas.getContext('2d');
			var w = Jcanvas.clientWidth;
			var h = Jcanvas.clientHeight;
			var mousedown = false;
			Jcanvas.width = w;
			Jcanvas.height = h;
			Jcanvas.style.backgroundColor = "#ffffff";

			if (c.fillStyle == "color") {
				ctx.fillStyle = c.fillContent;
				ctx.fillRect(0, 0, w, h);
				ctx.globalCompositeOperation = "destination-out";
				Jcanvas.style.backgroundColor = "transparent";
				c.inited && c.inited();
			}else if (c.fillStyle == "image") {
				preImage(c.fillContent, function() {
					ctx.drawImage(this, 0, 0, w, h);
					ctx.globalCompositeOperation = "destination-out";
					Jcanvas.style.backgroundColor = "transparent";
					c.inited && c.inited();
				});
			}else {
				return false;
			}


			var hastouch = "ontouchstart" in win ? true : false;
			var tapstart = hastouch ? "touchstart" : "mousedown";
			var tapmove = hastouch ? "touchmove" : "mousemove";
			var tapend = hastouch ? "touchend" : "mouseup";

			Jcanvas.addEventListener(tapstart, eventDown);
			Jcanvas.addEventListener(tapend, eventUp);
			Jcanvas.addEventListener(tapmove, eventMove);

			function preImage(url, callback) {
				var img = new Image();
				img.src = url;
				if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
					callback.call(img);
					return; //直接返回，不用再处理onload事件
				}
				img.onload = function() { //图片下载完毕时异步调用callback函数。
					callback.call(img); //将回调函数的this替换为Image对象
				};
			}

			function eventDown(e) {
				e.preventDefault();
				if (e.changedTouches) {
					e = e.changedTouches[e.changedTouches.length - 1];
				}
				mousedown = true;
				c.touchstart && c.touchstart(e);
			}

			var touchCount = 0;//刮的次数
			function eventUp(e) {
				e.preventDefault();
				if (e.changedTouches) {
					e = e.changedTouches[e.changedTouches.length - 1];
				}
				mousedown = false;
				c.touchend && c.touchend(e);
				try {
					// 假如支持getImageData跨域
					var data = ctx.getImageData(0, 0, w, h).data;
					//ctx.getImageData(0, 0, w, h).data是用rgba数值组成的数组
					var area = 0; //被刮去的面积
					for (var i = 0; i < data.length; i += 4) {
						if (data[i + 3] == 0) {
							area++;
						}
					}

					// 当刮了c.percent%的时候自动抹去
					var percent = parseInt(c.percent ? c.percent : 100) / 100;
					if (area >= w * h * percent) {
						Jcanvas.style.webkitTransitionDuration = "500ms";
						Jcanvas.style.MozTransitionDuration = "500ms";
						Jcanvas.style.msTransitionDuration = "500ms";
						Jcanvas.style.OTransitionDuration = "500ms";
						Jcanvas.style.transitionDuration = "500ms";
						Jcanvas.style.opacity = 0;
						setTimeout(function () {
							ctx.clearRect(0, 0, w, h);
							Jcanvas.style.webkitTransitionDuration = "0ms";
							Jcanvas.style.MozTransitionDuration = "0ms";
							Jcanvas.style.msTransitionDuration = "0ms";
							Jcanvas.style.OTransitionDuration = "0ms";
							Jcanvas.style.transitionDuration = "0ms";
							Jcanvas.style.opacity = 1;
						},500);
						c.complete && c.complete();
					}
				} catch (err) {
					var percent = parseInt(c.percent ? c.percent : 100) / 10;
					console.log("所引用图片地址不属于本域名 canvas中getImageData方法不支持跨域 改为刮了" + percent + "次之后自动抹去");
					touchCount++;
					if (touchCount > percent) {
						Jcanvas.style.webkitTransitionDuration = "500ms";
						Jcanvas.style.MozTransitionDuration = "500ms";
						Jcanvas.style.msTransitionDuration = "500ms";
						Jcanvas.style.OTransitionDuration = "500ms";
						Jcanvas.style.transitionDuration = "500ms";
						Jcanvas.style.opacity = 0;
						setTimeout(function () {
							ctx.clearRect(0, 0, w, h);
							Jcanvas.style.webkitTransitionDuration = "0ms";
							Jcanvas.style.MozTransitionDuration = "0ms";
							Jcanvas.style.msTransitionDuration = "0ms";
							Jcanvas.style.OTransitionDuration = "0ms";
							Jcanvas.style.transitionDuration = "0ms";
							Jcanvas.style.opacity = 1;
						},500);
						c.complete && c.complete();
					};
				}
			}

			function eventMove(e) {
				e.preventDefault();
				if (mousedown) {
					if (e.changedTouches) {
						e = e.changedTouches[e.changedTouches.length - 1];
					}
					// var offsetX = getAbsPoint(Jcanvas).x;
					// var offsetY = getAbsPoint(Jcanvas).y;
					// var x = e.pageX - offsetX;
					// var y = e.pageY - offsetY;

					var offsetX = Jcanvas.getBoundingClientRect().left;
					var offsetY = Jcanvas.getBoundingClientRect().top;
					var x = e.clientX - offsetX;
					var y = e.clientY - offsetY;

					ctx.beginPath();
					ctx.arc(x, y, c.radius, 0, Math.PI * 2);
					ctx.fill();
					c.touchmove && c.touchmove(e);
				}
			}

		},

		// 对 json 对象进行更新扩展，会修改待更新扩展的对象，同时将其返回。
		_extend: function(destination, source, override, replacer) {
			if (override === undefined) override = true;
			for (var property in source) {
				if (override || !(property in destination)) {
					if (replacer) replacer(property);
					else destination[property] = source[property];
				}
			}
			return destination;
		}
	};
	win.mask = mask;
})(window, document);



