/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var api    = require("./utils/api"),
    colors = require('colors'),
    shell  = require("./utils/shell");

module.exports = function (configuration, datastore) {
    "use strict";

    var unreadCmd = {};

    Object.defineProperties(unreadCmd, {
        "pattern": {
            enumerable: true,
            writable: false,
            value: "unread"
        },
        "description": {
            enumerable: true,
            writable: false,
            value: "Displays a nice list of all your unread websites."
        },
        "exec": {
            enumerable: true,
            writable: false,
            value: function () {
                var accessToken,
                    elderly;

                accessToken = configuration.get("accessToken");

                elderly = datastore.get();

                api.sync(accessToken, elderly, function (err, data) {
                    var items;

                    if (err) {
                        console.log(("\n ✖ Outsch. Getting your unread items was not successful: \n\n   " + err + "\n").red);
                    } else {
                        datastore.set(data);
                        datastore.save();

                        items = datastore.where("unread").is(true).end();

                        for (var k in items) {
                            if (items.hasOwnProperty(k)) {
                                console.log(items[k].given_title);
                            }
                        }
                    }

                    shell.exit(+(!!(err)));
                });
            }
        }
    });

    return unreadCmd;
};