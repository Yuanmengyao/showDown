const path = require('path'); //
const webpack = require('webpack'); //引入webpack库引入path模块
function resolve(dir) {
  return path.join(__dirname, dir); //path.join(__dirname)设置绝对路径
}

module.exports = {
  pwa: {
    // iconPaths: {
    //   favicon32: 'favicon.ico',
    //   favicon16: 'favicon.ico',
    //   appleTouchIcon: 'favicon.ico',
    //   maskIcon: 'favicon.ico',
    //   msTileImage: 'favicon.ico'
    // }
  },
  // baseUrl: '/', // 部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)
  outputDir: 'dist', // 运行时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  assetsDir: 'static', //放置生成的静态资源(s、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
  indexPath: 'index.html', //指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。

  pages: {
    //pages 里配置的路径和文档目录必须存在，否则启动服务报错
    index: {
      //除了entry之外都是可选的
      entry: 'src/main.js',  //page的入口，每个'page'都应该有一个对应的 JS 入口文件
      template: 'static/index.html',    //模板来源
      filename: 'index.html',
    }
  },
  productionSourceMap: false,   // 是否生成SourceMap文件定位错误
  css: {
    //css 预设器配置项
    loaderOptions: {
      //sass-loader
      sass: {
        //引入全局变量、方法等 
        prependData: `
               @import "@/assets/css/common.scss";
               @import "@/assets/css/var.scss";
               @import "@/assets/css/reset.scss";
               @import "@/assets/css/antd-theme.scss";
            `,
      },
    },
  },
  configureWebpack: config => {
    config.entry.app = ['babel-polyfill', './src/main.js'];
  },
  chainWebpack: config => {
    config.resolve.alias
      //set第一个参数：设置的别名，第二个参数：设置的路径
      //注意 store 和 router 没必要配置
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('assets', resolve('./src/assets'))
      .set('views', resolve('./src/views'))
      .set('api', resolve('./src/api'));

  },
  devServer: {
    port: 9801,
    host: '172.17.35.29',
    proxy: {
      '/': {
        target: 'http://172.17.35.24:20226',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/': '',
        }
      }
    },
  },
}