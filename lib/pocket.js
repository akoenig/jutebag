/*
 * pocket-cli
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
    	getRequestToken : function (cb) {
    		var pocket = new Pocket(CONSUMER_KEY);

    		pocket.getRequestToken({
    			url: "http://localhost:8090"
    		}, cb);
    	},
    	getAccessToken : function (code, cb) {
    		var pocket = new Pocket(CONSUMER_KEY);

    		pocket.getAccessToken({
    			code: code
    		}, function (err, data) {
    			if (err) {
    				cb(err);
    				return;
    			}

    			cb(null, data.access_token);
    		});
    	},
        add : function (config, url, cb) {
            var pocket = new Pocket(CONSUMER_KEY, config.accessToken);

            pocket.add({
            	url: url
            }, cb);
        }
    };
}());