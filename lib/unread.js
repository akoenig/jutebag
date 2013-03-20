/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var api        = require("./utils/api"),
    colors     = require('colors'),
    shell      = require("./utils/shell"),
    underscore = require("underscore");

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
        "options": {
            enumerable: true,
            writable: false,
            value: [
                {
                    "pattern": '-t, --tags "<comma-separated tags>"',
                    "description": "The tags you want to add to this URL."
                }
            ]
        },
        "exec": {
            enumerable: true,
            writable: false,
            value: function (options) {
                var accessToken,
                    tags,
                    elderly;

                accessToken = configuration.get("accessToken");

                tags = (options.tags || "").split(",");

                elderly = datastore.get();

                api.sync(accessToken, elderly, function (err, data) {
                    var items,
                        output = "\n";

                    if (err) {
                        console.log(("\n ✖ Outsch. Getting your unread items was not successful: \n\n   " + err + "\n").red);
                    } else {
                        datastore.set(data);
                        datastore.save();

                        items = datastore
                                    .where("unread")
                                    .is(true)
                                    .and("tags")
                                    .matches(tags)
                                    .end();

                        underscore.toArray(items).forEach(function (item) {
                            var TAB,
                                title,
                                tags;

                            TAB = "   ";
                            title = item.given_title ? " ★ " + item.given_title : ' ⚠ No title';
                            tags = underscore.pluck(underscore.toArray(item.tags), "tag").join(", ");

                            output += title.green.bold + "\n\n";
                            output += TAB + item.resolved_url + "\n\n";

                            output += TAB + ("ID: " + item.item_id + ((tags) ? " - Tags: " + tags : "") + "\n\n").grey;
                        });

                        console.log(output);
                    }

                    shell.exit(+(!!(err)));
                });
            }
        }
    });

    return unreadCmd;
};