/**
 * Created by tdzl2_000 on 2015-09-01.
 */

// Provide static file for express.js

"use strict";

var path = require("path");
var config = require("./webpack.config.js");
var staticPath = config.output.path;

exports.staticPath = staticPath;
exports.config = config;

var webpack = require("webpack");
var compiler = webpack(config);

exports.watch = function() {
    var watcher = compiler.watch({}, function (err, stats) {
        if (err) {
            if (stats) {
                console.error(stats.toString());
            } else {
                console.error(err.stack);
            }
            return;
        }
        console.log(stats.toString({colors:true, source:false, chunkModules:false}));
    });

    return watcher;
}