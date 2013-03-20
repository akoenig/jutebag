/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var cli = require("commander"),
    pkg = require("./package.json");

;(function () {
    "use strict";

    var jutebag = require("./lib/jutebag");

    process.title = pkg.name;

    cli.version(pkg.version);

    jutebag.commands.forEach(function (cmd) {
        cli.command(cmd.pattern)
           .description(cmd.description)
           .and(function (cli) {
                if (cmd.options) {
                    cmd.options.forEach(function (opt) {
                        cli.option(opt.pattern, opt.description);
                    });
                }
           })
           .action(cmd.exec);
    });

    cli.parse(process.argv);
})();