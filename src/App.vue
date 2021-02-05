<template>
	<a-config-provider :locale="locale">
		<div id="app">
			<NavBar v-if="$route.path !=='/login'  "></NavBar>
			<router-view></router-view>
		</div>
	</a-config-provider>
</template>
<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import NavBar from './views/navBar'
export default {
	components: {
		NavBar,
	},
	data() {
		return {
			locale: zh_CN,
			// zh_cn,
		}
	},
}
</script>
<style lang="scss">
#app {
  background: url('./assets/images/bg@2x.png') no-repeat center;
  background-size: 100% 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  width: 100%;
  height: 100%;
}
</style>
