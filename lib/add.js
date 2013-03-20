/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

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
            value: function () {
                console.log("Executing add command");
            }
        }
    });

    return addCmd;
};