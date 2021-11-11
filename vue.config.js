const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    productionSourceMap: false,
    assetsDir: 'assets',
    css: {
        loaderOptions: {
            sass: {
                // 1、在 package.json 中修改 sass-loader 的版本： "sass-loader": "^7.1.0"
                // 2、安装依赖：$ cnpm i
                // https://blog.csdn.net/liwan09/article/details/106981239
                data: `
                @import "~@/styles/variables.scss";
                @import "~@/styles/mixin.scss";
            `,
            },
        },
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                cesium: path.resolve(__dirname, cesiumSource),
            },
        },
        plugins: [
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
            new webpack.DefinePlugin({ CESIUM_BASE_URL: JSON.stringify('/'), }),
        ],
        module: {
            unknownContextCritical: false,
        },
        amd: {
            toUrlUndefined: true,
        },
    },
    devServer: {
        port: 8081,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        proxy: {
            '/api': {
                target: 'http://14.18.232.165:8199',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/',
                }
            },
        },
    },
}
