/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

 /* global require: true, modules: true */ 

var fs   = require("fs"),
    html = require("to-markdown");

;(function () {
    "use strict";

    exports.saveHTML = function (content) {
        content = html.toMarkdown(content);        

        return {
            to : function (filename, cb) {
                filename += ".md";

                fs.writeFile(filename, content, "utf8", function (err) {
                    cb(err, filename);
                });
            }
        };
    };
})();