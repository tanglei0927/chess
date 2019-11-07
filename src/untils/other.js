/*
 * 实时监测网络状态的变化,不用setInterval
 */
function hasNet(fun) {
	//navigator.onLine
	var EventUtil = {
		addHandler: function(element, type, handler) {
			if(element.addEventListener) {
				element.addEventListener(type, handler, false);
			} else if(element.attachEvent) {
				element.attachEvent("on" + type, handler);
			} else {
				element["on" + type] = handler;
			}
		}
	};
	//重新连上网络时
	EventUtil.addHandler(window, "online", function() {
		//this.$router.go(-1);
		// console.log("连上网了！");
	});
	//网络断开时
	EventUtil.addHandler(window, "offline", function() {
		//执行回调函数
		fun();
	});
}
//实时获取网络状态
function hasNet2(fun1,fun2){
	return setInterval(function(){
		if(navigator.onLine){
			fun1();//有网
		}else{
			fun2();//没网
		}
	}, 1000);
}
//判断客户端是pc还是手机(客户端为pc返回true)
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone",
		"iPad", "iPod"
	];
	var flag = true;
	for(var v = 0; v < Agents.length; v++) {
		if(userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
//判断客户端是Android还是IOS(客户端为Android返回true)
function IsAndroid() {
	var userAgent = navigator.userAgent;
	var isAndroid = userAgent.indexOf("Android") > -1 || userAgent.indexOf("Adr") > -1; //android终端
	var isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	//console.info("是否是Android：" + isAndroid);
	//console.info("是否是IOS：" + isIOS);
	if(isAndroid) {
		return true;
	} else {
		return false;
	}
}
//是否滚动到了浏览器底部
function isBottom(callback) {
	//滚动条在Y轴上的滚动距离
	function getScrollTop() {　　
		var scrollTop = 0,
			bodyScrollTop = 0,
			documentScrollTop = 0;　　
		if(document.body) {　　　　
			bodyScrollTop = document.body.scrollTop;　　
		}　　
		if(document.documentElement) {　　　　
			documentScrollTop = document.documentElement.scrollTop;　　
		}　　
		scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;　　
		return scrollTop;
	}

	//文档的总高度

	function getScrollHeight() {　　
		var scrollHeight = 0,
			bodyScrollHeight = 0,
			documentScrollHeight = 0;　　
		if(document.body) {　　　　
			bodyScrollHeight = document.body.scrollHeight;　　
		}　　
		if(document.documentElement) {　　　　
			documentScrollHeight = document.documentElement.scrollHeight;　　
		}　　
		scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;　　
		return scrollHeight;
	}

	//浏览器视口的高度

	function getWindowHeight() {　　
		var windowHeight = 0;　　
		if(document.compatMode == "CSS1Compat") {　　　　
			windowHeight = document.documentElement.clientHeight;　　
		} else {　　　　
			windowHeight = document.body.clientHeight;　　
		}　　
		return windowHeight;
	}

	window.onscroll = function() {　　
		if(getScrollTop() + getWindowHeight() == getScrollHeight()) {　　　　
			//alert("已经到最底部了！");
			callback();　　
		}
	};
}
//请求图片到七牛云地址
function postImg(axios, url, params, lock, baseurl, header) {
	return axios({
			method: 'post',
			baseURL: baseurl,
			url: url,
			data: params,
			timeout: 150000,
			headers: header
		})
		.then(function(res) {
			return checkStatus(res, lock)
		})
}
//请求图片到七牛云地址的响应状态处理
function checkStatus(response, lock) {
	// 如果http状态码正常，则直接返回数据
	if(response && (response.status === 200 || response.status === 304 || response.status === 400)) {
		return response.data
		// 如果不需要除了data之外的数据，可以直接 return response.data
	} else {
		if(lock) { // 是否提示 true不显示，false 显示
			alert('网络异常')
		}
		return response
	}
}
//是否为json格式(不是json格式的字符串转化为json格式会报错的,下面是最严谨的写法)
function isJSON(str) {
	if(typeof str == 'string') {
		try {
			let obj = JSON.parse(str);
			if(typeof obj == 'object') {
				return true;
			} else { //防止字符串为'123'这种东西也能JSON.parse成功
				return false;
			}
		} catch(e) {
			return false;
		}
	}
}
//日期相减得天数
function DateMinus(date1, date2) { //date1:小日期   date2:大日期
	var sdate = new Date(date1);  　　
	var now = new Date(date2);  　　
	var days = now.getTime() - sdate.getTime();  　　
	var day = parseInt(days / (1000 * 60 * 60 * 24));  　　
	return day;  
}
//JS获取当前周从星期一到星期天的日期
function getWeekDay(currentTime) {
	var currentDate = new Date(currentTime)
	var timesStamp = currentDate.getTime();
	var currenDay = currentDate.getDay();
	var dates = [];
	for (var i = 0; i < 7; i++) {
	    dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '-'));
	}
	return dates
}
//获得某月的天数 
function getMonthDays(nowYear,myMonth){ 
var monthStartDate = new Date(nowYear, myMonth, 1); 
var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
return days; 
} 
//格式化日期：yyyy-MM-dd 
function formatDate(date) { 
	var myyear = date.getFullYear(); 
	var mymonth = date.getMonth()+1; 
	var myweekday = date.getDate(); 
	
	if(mymonth < 10){ 
	mymonth = "0" + mymonth; 
	} 
	if(myweekday < 10){ 
	myweekday = "0" + myweekday; 
	} 
	return (myyear+"-"+mymonth + "-" + myweekday); 
}
//获得本月的开始日期
function getMonthStartDate(nowYear,nowMonth){ 
var monthStartDate = new Date(nowYear, nowMonth-1, 1); 
return formatDate(monthStartDate); 
} 
//获得本月的结束日期
function getMonthEndDate(nowYear,nowMonth){ 
var monthEndDate = new Date(nowYear, nowMonth-1, getMonthDays(nowYear,nowMonth-1)); 
return formatDate(monthEndDate); 
}
//打开app(暂未实现:检测app是否安装)(参数url是Scheme协议地址,参数url2是普通地址)
function openApp(vm,name, url, url2) {
	let startTime = new Date();
	/*
	 * 方法一:询问用户如何打开地图(app or web)
	 */
	vm.$dialog.confirm({
		title: `选择打开方式`,
		message: `<font color="#4CAF50" size="4">你是否已安装${name}的app?</font><br />(如果【还没有】则打开web地图)`,
		cancelButtonText:'还没有',
		confirmButtonText:'是的,我安装了',
	}).then(() => {
		window.location.href= url;
	}).catch(() => {
		window.location.href= url2;
	});
	/*
	 * 方法二:由于跳转Scheme协议会在网页弹出询问框(是否同意打开...app),如果同意打开app,将会进入app,直到再次切换到到浏览器之前,后面的js会被阻塞.
	 * 注意:询问框不会阻塞js.而离开浏览器直接进入app会阻塞js(在安卓端:第一次弹出询问框时同意打开app后,后面再打开Scheme协议都不会弹出询问框而是直接进入app;ios端:每次都会询问.所以此方法二不适用ios端)
	 * 利用这个原理:我先跳转原生app的Scheme地址,然后我在500毫秒后计算时间,如果4秒内(其实是3.5秒)就执行了setTimeout(4秒内阻塞停止了,可能是用户关闭了询问框,或者因为没安装app根本没有询问框),那就打开web地图的http地址
	window.location.href= url;
	setTimeout(function(){
		let endTime = new Date();
		if(endTime.getTime()-startTime.getTime() < 4000){
			window.location.href= url2;
		}
	},500)
	 */
}
//rgb颜色随机
function rgb(){
	var r = Math.floor(Math.random()*256);
	var g = Math.floor(Math.random()*256);
	var b = Math.floor(Math.random()*256);
	var rgb = [r,g,b];
	return rgb;
}
//十六进制颜色随机
function color16(){
	var color = '#'+Math.floor(Math.random()*0xffffff).toString(16).padEnd(6, '0');
	return color;
}
//返回颜色相近的一个前景色和一个背景色
function groundColor(){
	let arr = rgb();
	let color1 = "rgba("+arr[0]+","+arr[1]+","+arr[2]+","+"1)";
	let color2 = "rgba("+arr[0]+","+arr[1]+","+arr[2]+","+"0.1)";
	return [color1,color2];
}

//封装用于上传文件的lib:"webuploader"(百度出品)
function initWebuploader(ele){
	/*
	let WebUploader = require("webuploader/dist/webuploader.js")
	//require("webuploader/css/webuploader.css")
	let uploader = WebUploader.create({
		//文件名
		fileVal:'fileName',
	    // swf文件路径
	    swf: require('webuploader/dist/Uploader.swf'),
	    // 文件接收服务端。
	    server: '/file/uploadFile',
	    // 选择文件的按钮。可选。
	    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
	    pick: {
	    	id:ele,
	    	//是否可多个文件同时上传
       		multiple:true
	    },
	    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
	    resize: true,
	    // 开启分片上传。
	    //chunked: true,
	    //自动上传
	   	auto:true,
	    //配置生成缩略图的选项
	    thumb:{
	    	// 图片质量，只有type为`image/jpeg`的时候才有效。
			quality: 70,
			// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
			allowMagnify: false,
			// 是否允许裁剪。
			crop: true,
			// 为空的话则保留原有图片格式。
		    // 否则强制转换成指定的类型。
		    type: 'image/jpeg'
	    },
	    compress:{
	    	// 图片质量，只有type为`image/jpeg`的时候才有效。
			quality: 90,
			// 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
		    allowMagnify: false,
		    // 是否允许裁剪。
		    crop: false,
		    // 如果发现压缩后文件大小比原来还大，则使用原来图片
		    // 此属性可能会影响图片自动纠正功能
		    noCompressIfLarger: true,
		    // 单位字节，如果图片大小小于此值，不会采用压缩。
		    compressSize: 0
	    },
	    // 只允许选择文件，可选。
        accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        //文件大小不准超过20M
        //fileSizeLimit:20971520,
       	//是否已二进制的流的方式发送文件
       	//sendAsBinary:true
	})
	/*
	uploader.on( 'uploadSuccess', function( file ) {
	    console.log('已上传');
	});
	
	uploader.on( 'uploadError', function( file ) {
	    console.log('上传出错');
	});
	*/
	return uploader;
}
//base64码字符串转可以用form表单上传的file文件
function baseToFile(base64Str,filename){
	//将base64转换为blob
	let dataURLtoBlob=function(dataurl) { 
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	};
	//将blob转换为新的blob
	let blobToFile=function(theBlob, fileName){
	   theBlob.lastModifiedDate = new Date();
	   theBlob.name = fileName;
	   return theBlob;
	};
	//调用
	let blob = dataURLtoBlob(base64Str);
	let newBlob = blobToFile(blob, filename);
	//将新的blob转换为file
	let file = new File([newBlob],filename)
	return file;
}
//滚动条滚动到指定位置（平滑滚动）
function scrollAnimation(currentY, targetY) {
 // 获取当前位置方法
 // const currentY = document.documentElement.scrollTop || document.body.scrollTop

 // 计算需要移动的距离
 let needScrollTop = targetY - currentY
 let _currentY = currentY
 setTimeout(() => {
   // 一次调用滑动帧数，每次调用会不一样
   const dist = Math.ceil(needScrollTop / 10)
   _currentY += dist
   window.scrollTo(_currentY, currentY)
   // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
   if (needScrollTop > 10 || needScrollTop < -10) {
     window.scrollTo(_currentY, targetY)
   } else {
	   //滚动的浏览器API
     window.scrollTo(_currentY, targetY)
   }
 }, 1)
}
export default {
	hasNet,
	hasNet2,
	IsPC,
	IsAndroid,
	isBottom,
	postImg,
	isJSON,
	DateMinus,
	getWeekDay,
	getMonthStartDate,
	getMonthEndDate,
	openApp,
	rgb,
	color16,
	groundColor,
	initWebuploader,
	baseToFile,
	scrollAnimation
}