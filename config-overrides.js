const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer,
  addWebpackAlias,
  adjustWorkbox,
  addLessLoader,
  overrideDevServer,
  fixBabelImports
} = require('customize-cra');

const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const rewirePostcss = require("react-app-rewire-postcss");
const px2rem = require("postcss-px2rem-exclude");
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
/**
 * 添加压缩
 * @returns 
 */
const addCustomize = () => config => {
  if (process.env.NODE_ENV === 'production') {
    // 关闭sourceMap
    config.devtool = false;
    // 配置打包后的文件位置
    // config.output.path = resolve('dist');
    // config.output.publicPath = './';
    // 添加js打包gzip配置
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\.css$/,
        threshold: 1024,
      }),
    )
  }
  return config;
}

const devServerConfig = () => config => {
  return {
    ...config,
    proxy: {
      '/rescue-api': {
        target: 'http://192.168.31.115/',
        changeOrigin: true,
        secure: false,
        // pathRewrite: {
        //   '^/api': '/api',
        // },
      }
    }
  }
}

module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    disableEsLint(),
    addBundleVisualizer({}, true),
    // addPostcssPlugins([
    //   require('postcss-px2rem')({
    //     // px2rem({ remUnit: 75 }) 的意思就是1rem = 75px 这个是根据750px设计稿来的，如果是620 的就写 62
    //     // 这里最开始写的是75，antd 设置的是37.5 为了一直改成37.5
    //     // 移出 检查/node_modules/ 如果不配置 Ant Design Mobile 样式会出错　　　　　　　　　　
    //     remUnit: 192, 
    //     exclude:/node-modules/
    //   })
    // ]),
    addCustomize(),
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets')
    }),
    adjustWorkbox(wb =>
      Object.assign(wb, {
        skipWaiting: true,
        exclude: (wb.exclude || []).concat('index.html')
      })
    ),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
    // 使用less-loader对源码重的less的变量进行重新制定，设置antd自定义主题
    addLessLoader({
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#3580FD'
        },
      }
    }),
    (config, env) => {
      // 重写postcss
      // px2rem({ remUnit: 75 }) 的意思就是1rem = 75px 这个是根据750px设计稿来的，如果是620 的就写 62
      // 这里最开始写的是75，antd 设置的是37.5 为了一直改成37.5
      // 移出 检查/node_modules/ 如果不配置 Ant Design Mobile 样式会出错　
      rewirePostcss(config, {
        plugins: () => [
          // require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009",
            },
            stage: 3,
          }),
          //关键:设置px2rem
          px2rem({
            remUnit: 192,
            exclude: /node-modules|Edit/i,
          }),
        ],
      });
      config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
      return config;
    }
  ),
  devServer: overrideDevServer(
    devServerConfig()
  )
}
//  /home/nginx/conf