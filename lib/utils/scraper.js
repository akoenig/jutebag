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

var readability = require("node-readability");

module.exports = (function () {
    "use strict";

    return {
        convert : function (url, cb) {
            readability.read(url, function (err, article) {
                cb(err, {
                    title: article.getTitle(),
                    content: article.getContent()
                });
            });
        }
    };
})();