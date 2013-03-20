/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

require("coffee-script");

var Pocket = require("node-pocket");

module.exports = (function () {
    "use strict";

    var CONSUMER_KEY = "12478-c9b80470aa8931337c551c64";

    return {
        getRequestToken : function (redirectUrl, cb) {
            var pocket = new Pocket(CONSUMER_KEY);

            pocket.getRequestToken({
                url: redirectUrl
            }, cb);
        },
        getAccessToken : function (requestToken, cb) {
            var pocket = new Pocket(CONSUMER_KEY);

            pocket.getAccessToken({
                code: requestToken
            }, function (err, data) {
                if (err) {
                    cb(err);
                    return;
                }

                cb(null, data.access_token);
            });
        },
        add : function (accessToken, url, tags, cb) {
            var pocket = new Pocket(CONSUMER_KEY, accessToken);

            pocket.add({
                url: url,
                tags: tags
            }, cb);
        }
    };
})();