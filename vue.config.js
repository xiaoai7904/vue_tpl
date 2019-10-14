const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir);
}

const proxy = {
  target: 'http://192.168.1.8:20000',
  changeOrigin: true
};

if (process.env.NODE_ENV !== 'production') {
  let processArgv = process.argv;
  let _url = processArgv[processArgv.length - 1].match(/url=(.*)/);
  if (_url && _url.length >= 2) {
    proxy.target = `${_url[1]}`;
  }
}

module.exports = {
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  configureWebpack: {},
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/userfront': proxy,
      '/sys': proxy,
      '/datatransfer': proxy
    }
  }
};
