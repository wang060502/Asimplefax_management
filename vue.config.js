const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: './',
  // 将构建后的文件输出到 `dist` 目录
  outputDir: 'dist',

  // 将静态资源目录设置为 `static`
  assetsDir: 'static',

  transpileDependencies: true,

  // devServer 代理配置
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://139.196.195.212:8081', // 目标 API 服务器地址
        changeOrigin: true, // 是否改变源
        pathRewrite: { '^/api': '' } // 路径重写
      }
    }
  }
})
