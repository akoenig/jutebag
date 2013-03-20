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

module.exports = (function () {
    "use strict";

    var home,
        filename;

    home = process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"] + path.sep + ".jutebag";
    filename = "config.json";

    return {
        exists : function () {
            var exists = fs.existsSync(home);

            if (exists) {
                exists = fs.existsSync(home + path.sep + filename);
            }

            return exists;
        },
        save : function (data) {
            var exists = fs.existsSync(home);

            if (!exists) {
                fs.mkdirSync(home);
            }

            fs.writeFileSync(home + path.sep + filename, JSON.stringify(data));
        },
        load : function () {
            var config;

            try {
                config = require(home + path.sep + filename);
            } catch (e) {}

            return config;
        }
    };
}());