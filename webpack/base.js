var time = require('./time');
var timeStr = '构建时间为 ===>  '+time(new Date(),'YYYY-MM-DD HH:mm');
console.log('$$$$$$$$$$$$$$$$$$$$$$   '+timeStr+'   $$$$$$$$$$$$$$$$$$$$$$');


const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const ENV = process.env.NODE_ENV ;
const g   = path.resolve(__dirname,'..','src-depend-global');
const src = path.resolve(__dirname,'..','src');
const enterPath  = path.join(src,'main.js');
const outputPath = path.resolve(__dirname,'..','dist');

module.exports = {
    devtool:'eval-source-map',
    entry: {
        app: ["babel-polyfill", enterPath ] ,
        public: ['vue','vuex','vue-router','axios']
    },
    output:{
        path: outputPath ,
        filename:'[name]-[hash:7].js',
        chunkFilename:'[id].index-[chunkhash:7].js'
    },
    resolve: {
        alias: {
            // LAN    :  path.resolve(__dirname,'..','LAN'), // 判断浏览器语言 ;
            vue$   : 'vue/dist/vue.esm.js',
            g      : g ,
            src    : src ,
            assets : path.join(src,'assets'),
            components : path.join(src,'components'),
        },
        extensions: ['.js', '.vue', '.less', '.css']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [{loader: 'vue-loader'}],
                exclude: /^node_modules$/,
            },
            {
                test: /\.js$/,
                use: [{loader: 'babel-loader'}],
                exclude: /^node_modules$/,
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                      fallback: 'style-loader',
                      use: [{loader: 'css-loader', options: {minimize: false}},{loader: 'postcss-loader'}]
                }),
                exclude: /^node_modules$/,          
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                      fallback: 'style-loader',
                      use: [{loader: 'css-loader', options: {minimize: false}},{loader: 'postcss-loader'},{loader: 'less-loader'}]
                }),
                exclude: /^node_modules$/,
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [{loader: 'url-loader',options: {limit: 204800,name: 'fonts/[name].[hash:7].[ext]'}}],//大于20k打包进fonts文件夹
                exclude: /^node_modules$/,
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{loader: 'url-loader',options: {limit: 204800,name: 'img/[name].[hash:7].[ext]'}}],//大于20k打包进img文件夹
                exclude: /^node_modules$/,
            }
        ]
    },
    plugins: [
        // 请确保引入这个插件来施展魔法
        new VueLoaderPlugin(),

        // 直接通过服务器引入需要考培文件夹 --- 不会经过编译 ;
        new CopyWebpackPlugin([{
            from: path.join(src,'assets'),// 空页面 echarts 移动dist文件夹
            to: path.join(outputPath,'assets')
        }]),
        
        new webpack.DefinePlugin({
            "timeStr":JSON.stringify(timeStr) ,
            "ENV": JSON.stringify(ENV)
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'public',
            filename: 'public-[hash:7].js', //业务模块不用hash
        }),
        new ExtractTextPlugin({
            filename: 'style-[hash:7].css'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            title: "",
            favicon:  path.join(src,'assets','images','./favicon.ico'),
            template: path.join(src,'assets','html','index.html'),
            filename: 'index.html',
        })
    ]
}





