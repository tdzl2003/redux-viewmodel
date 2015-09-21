/**
 * Created by tdzl2_000 on 2015-08-28.
 */

'use strict';

var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));
var DEBUG = !argv.release;

var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';

var GLOBALS = {
    'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
    '__DEV__': DEBUG
};

var path = require("path");

var rootPath = path.dirname(module.filename);

var config = {
    output: {
        filename: 'app.js',
        path: path.join(rootPath,  DEBUG?'build-debug/':'build-release/'),
        publicPath: '/static/',
        sourcePrefix: '  '
    },
    entry: path.join(rootPath, 'src/app.js'),
    plugins: ([
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.DefinePlugin(GLOBALS)
        ].concat(DEBUG ? [] : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.AggressiveMergingPlugin()
        ])
    ),
    cache: DEBUG,
    debug: DEBUG,
    devtool: DEBUG ? '#inline-source-map' : false,

    resolve: {
        root: rootPath,
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },
    resolveLoader: {
        root: path.join(rootPath, 'node_modules'),
        extensions: ['', '.loader.js', '.js', '.jsx']
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],

        loaders: [
            {
                test: /(\.eot)|(\.woff2?)|(\.ttf)$/,
                loader: 'file-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER +
                '!less-loader'
            },
            {
                test: /\.gif/,
                loader: 'url-loader?limit=10000&mimetype=image/gif'
            },
            {
                test: /\.jpg/,
                loader: 'url-loader?limit=10000&mimetype=image/jpg'
            },
            {
                test: /\.png/,
                loader: 'url-loader?limit=10000&mimetype=image/png'
            },
            {
                test: /\.svg/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
            },
            {
                test: /\.jsx?$/,
                exclude:function(t){
                        return /node_modules/.test(path.relative(rootPath, t));
                    },
                loader: 'babel-loader'
            }
        ]
    },
}

module.exports = config;
