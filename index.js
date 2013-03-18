/*
 * pocket-cli
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

(function () {
    "use strict";

    var config = require("./lib/config"),
        colors = {},
        cli    = require("commander"),
        pkg    = require("./package.json"),
        pocket = require("./lib/pocket");

    colors.red   = "\u001b[31m";
    colors.reset = "\u001b[0m";
    colors.green = "\u001b[32m";

    function assistant () {
        var data = {};

        cli.prompt("Pocket consumer key: ", function (key) {
            if (!key) {
                console.log("\n " + colors.red + "✖ Please define the consumer key \n" + colors.reset);

                assistant();
            } else {
                data.consumerKey = key;

                config.save(data);

                console.log("\n " + colors.green + "✓ Saved configuration. Now you are ready to use Pocket.\n" +  colors.reset);

                end();
            }
        });
    }

    function isValidUrl (url) {
    	return /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/.test(url);
    }

    function end () {
    	process.stdin.destroy();
    }

    if (!config.exists()) {
        console.log("\n " + colors.red + "✖ Configuration file is not available\n" + colors.reset);

        assistant();
    }

    cli.version(pkg.version)

    cli
    	.command("init")
        .description("Configuration assistant")
        .action(function () {
        	assistant();
        });

    cli
    	.command("add [url]")
        .description("Adds a website into your pocket")
        .action(function (url) {
        	if (isValidUrl(url)) {
        		pocket.add(url, function (err) {
        			if (err) {
        				console.log("\n " + colors.red + "✖ Outsch. Saving URL was not successful.\n" + colors.reset);

        				return;
        			}

        			console.log("\n " + colors.green + "✓ Saved configuration. Now you are ready to use Pocket.\n" +  colors.reset);

        			end();
        		});
        	} else {
        		console.log("\n " + colors.red + "✖ Not a valid URL.\n" + colors.reset);

        		end();
        	}
      	});

    cli.parse(process.argv);
}());