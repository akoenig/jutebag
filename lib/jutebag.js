/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var fs   = require("fs"),
    path = require("path");

;(function () {
    "use strict";

    var jutebag = module.exports,
        modules;

    // Add commands. Read all files from the current directory
    // and require them if they do not match the current module ('jutebag.js')
    jutebag.commands = [];

    modules = fs.readdirSync(__dirname);
    modules.forEach(function (module) {
        var stats = fs.statSync(__dirname + path.sep + module);

        if (!stats.isDirectory() && path.extname(module) === ".js" && __filename.indexOf(module) === -1) {
            jutebag.commands.push(require('./' + module.replace(path.extname(module), "")));
        }
    });    
})();