const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
    //配置项 写入在这里
    //入口文件 就是 全局的js文件 其他所有js都在这里
    entry: path.join(__dirname, '/js/index.js'),
    //项目打包之后的路径
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
        clean: true, // 自动将上次打包目录资源清空
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/public/index.html'),
            minify: {  // 压缩html
                collapseWhitespace: true, // 折叠空白区域
                keepClosingSlash: true,  // 保持闭合间隙
                removeComments: true,   // 移除注释
                removeRedundantAttributes: true, // 删除冗余属性
                removeScriptTypeAttributes: true,  // 删除Script脚本类型属性
                removeStyleLinkTypeAttributes: true, // 删除样式链接类型属性
                useShortDoctype: true, // 使用短文档类型
                preserveLineBreaks: true, // 保留换行符
                minifyCSS: true, // 压缩文内css
                minifyJS: true, // 压缩文内js
            }
        }),
        new UglifyJsPlugin({
            extractComments: false, //启用/禁用提取注释。
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/, //打包规则应用到以css结尾的文件上
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: "images/[hash:8][ext][query]",
                }
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-withimg-loader',
                },
            }
        ],
    },
    devServer: {
        port: 8000,//开打项目的端口
        open: true, //是否自动打开网页
        hot: true // 开启热更新HMR，只能跟新css。js和图片需要手动更新
    },
    // 开发模式  production  或者development
    mode: "development"
}