/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var api       = require("./utils/api"),
    colors    = require("colors"),
    shell     = require("./utils/shell"),
    validator = require("./utils/validator");

module.exports = function (configuration) {
    "use strict";

    var addCmd = {};

    Object.defineProperties(addCmd, {
        "pattern": {
            enumerable: true,
            writable: false,
            value: "add [url]"
        },
        "description": {
            enumerable: true,
            writable: false,
            value: "Adds a website into your pocket"
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
            value: function (url, options) {
                var accessToken,
                    tags;

                accessToken = configuration.get("accessToken");

                tags = options.tags;

                if (validator.isValidURL(url)) {
                    api.add(accessToken, url, tags, function (err) {
                        var messages = {
                            success: "\n ✓ Saved URL.\n".green,
                            failure: ("\n ✖ Outsch. Saving URL was not successful: \n\n   " + err + "\n").red
                        };

                        console.log(messages[!(err) ? 'success' : 'failure']);

                        shell.exit(+(!!err));
                    });
                } else {
                    console.log("\n ✖ Not a valid URL.\n".red);

                    shell.exit();
                }
            }
        }
    });

    return addCmd;
};