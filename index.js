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
    underscore = require("underscore"),
    pkg = require("./package.json");

;(function () {
    "use strict";

    var jutebag = require("./lib/jutebag"),
        command;

    process.title = pkg.name;

    cli.version(pkg.version);

    // Binding the 'jutebag' commands
    // to the command line interface.
    for (command in jutebag.commands) {
        if (jutebag.commands.hasOwnProperty(command)) {
            command = jutebag.commands[command];

            cli
               .command(command.pattern)
               .description(command.description)
               .and(function (cli) {
                    if (command.options) {
                        command.options.forEach(function (option) {
                            cli.option(option.pattern, option.description);
                        });
                    }
               })
               .action(command.exec);
        }
    }

    // Executing the 'init' command if there is
    // no configuation available.
    if (!jutebag.configuration.exists()) {
        underscore.findWhere(jutebag.commands, {pattern: 'init'}).exec();
    } else {
        cli.parse(process.argv);
    }
})();
