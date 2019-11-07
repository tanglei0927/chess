<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  created(){
    var that=this
      var screenHeight=window.screen.height
      var screenWidth=window.screen.width
      if(screenWidth<screenHeight){
        console.log("横屏")
        plus.screen.lockOrientation("landscape-primary")
      }
      // 监听“返回”按钮事件
			if (plus) {
				var firstBack = 0;
				var handleBack = function() {
					var currentWebview = plus.webview.currentWebview();
					var topWebview = plus.webview.getTopWebview();
					var now = Date.now || function() {
						return new Date().getTime();
					};
					currentWebview.canBack(function(evt) {
						/**  
						 * 有可后退的历史记录，则后退。  
						 * 否则，关闭当前窗口。  
						 * 如果当前窗口是入口页，那么执行退出的逻辑。  
						 */
						if (currentWebview.id === plus.runtime.appid && that.$route.path == '/') { //必须是在首页才询问是否退出应用！
							if (!firstBack) {
								firstBack = now();
								plus.nativeUI.toast('再按一次退出应用');
								setTimeout(function() {
									firstBack = 0;
								}, 2000);
							} else if (now() - firstBack < 2000) {
								plus.runtime.quit();
							}
						} else {
							//像这些直播控件的webview则不做处理
							if (that.$route.path == '/liveDetails' || that.$route.path == '/liveDetails2' || that.$route.path ==
								'/liveControl' || that.$route.path == '/liveControl2' || that.$route.path == '/liveControl3') {

							} else {
								//既不是首页，也不是直播控件的页面则能返回就返回。
								if (evt.canBack) {
									history.back();
								} else {
									currentWebview.close('auto');
								}
							}
						}
					})
				}
				//开始调用【监听返回键】的方法
				plus.key.addEventListener("backbutton", handleBack);
			}
			//引用图标库“fontawesome”（改为在首页index.html中使用）
			//require('@/assets/other/css/font-awesome.min.css')
			/**
			 * 路由管理
			 */
			//路由前进时
			this.$navigation.on('forward', (to, from) => {
				//设置过渡动画类型（“vant ui”自带）
				//this.animation="van-slide-left";
			})
			//路由后退时
			this.$navigation.on('back', (to, from) => {
				console.log(to.route.path, from.route.path)
				//this.animation="van-slide-right";
				//业务逻辑处理
				/*(后退到这个to的路由页面时，强制刷新当前路由地址！即当前路由页面不去使用“vue-navigation”的后退缓存功能！！！
				* （from的地址即使是通过router.go方法进入的to页面，to页面依然会刷新）)
				* 
				if((to.route.path=="/purchase" || to.route.path=="/sell") && from.route.path=="/success"){
					this.$navigation.cleanRoutes();//清除所有的路由缓存
					this.$router.replace({path:to.route.path})//重定向
				}
				* 
				* TIP:上面已弃用。改为在/success路由里执行【$navigation.cleanRoutes();$router.go(-1);】来清除to页面缓存。
				*/
			})
  }
}
</script>
<style lang="less" scoped>
 #app {
   font-family: 'Avenir', Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
  color: #2c3e50;
  height: 7.5rem;
  border: 1px solid red;
 } 

</style>
