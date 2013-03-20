/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

module.exports = (function () {
    "use strict";

    var initCmd = {};

    Object.defineProperties(initCmd, {
        "pattern": {
            enumerable: true,
            writable: false,
            value: "init"
        },
        "description": {
            enumerable: true,
            writable: false,
            value: "Configuration assistant"
        },
        "exec": {
            enumerable: true,
            writable: false,
            value: function () {
                console.log("Executing init command");
            }
        }
    });

    return initCmd;
})();