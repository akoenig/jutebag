/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var fs         = require("fs"),
    path       = require("path"),
    storage    = require("./utils/storage"),
    underscore = require("underscore"),
    HOME       = process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"] + path.sep + ".jutebag";

;(function () {
    "use strict";

    var jutebag = module.exports,
        modules;

    // Init the storage layer.
    // Defining the meta data for the creatable stores.
    storage.init({
        configuration: HOME + path.sep + "config.json",
        data: HOME + path.sep + "data.json"
    });

    jutebag.configuration = storage.getStore("configuration");
    jutebag.configuration.load();

    jutebag.datastore = storage.getStore("data");
    jutebag.datastore.load();

    // Add commands. Read all files from the current directory and
    // require them if they do not match the current module ('jutebag.js').
    jutebag.commands = {};

    modules = fs.readdirSync(__dirname);
    modules.forEach(function (module) {
        var stats = fs.statSync(__dirname + path.sep + module);

        if (!stats.isDirectory() && path.extname(module) === ".js" && __filename.indexOf(module) === -1) {
            module = module.replace(path.extname(module), "");

            jutebag.commands[module] = require('./' + module)(jutebag.configuration, jutebag.datastore);
        }
    });

    // Sort the commands
    if (underscore.isObject(jutebag.commands)) {
        jutebag.commands = underscore.toArray(jutebag.commands);
    }

    jutebag.commands = jutebag.commands.sort(function (cmd1, cmd2) {
        return cmd1.id - cmd2.id;
    });

    console.log(jutebag.commands);
})();