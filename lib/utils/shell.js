/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

 /* global exports: true */ 

;(function () {
    "use strict";

    exports.exit = function (code) {
        process.exit(code || 0); // Default value 0
    };
})();