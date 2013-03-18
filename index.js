/*
 * jutebag
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
        http   = require("http"),
        pkg    = require("./package.json"),
        pocket = require("./lib/pocket");

    colors.red   = "\u001b[31m";
    colors.reset = "\u001b[0m";
    colors.green = "\u001b[32m";

    function authentication () {
        var code,
            server,
            sockets = [],
            indicator;

        server = http.createServer(function (req, res) {
            if (req.url === "/") {
                pocket.getAccessToken(code, function (err, accessToken) {
                    var i;

                    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
                    res.end("✓ Cool! Now you can use your 'jutebag'. Have fun!");

                    config.save({
                        accessToken: accessToken
                    });

                    console.log("\n\n  " + colors.green + "✓ Done! Have fun.\n" +  colors.reset);

                    server.close();

                    for (i = 0; i < sockets.length; i++) {
                        sockets[i].destroy();
                    }

                    clearInterval(indicator);

                    end();
                });
            }
        }).listen(8090, 'localhost');

        server.on('connection', function (socket) {
            sockets.push(socket);
            socket.setTimeout(4000);
            socket.on('close', function () {
                sockets.splice(sockets.indexOf(socket), 1);
            });
        });

        pocket.getRequestToken(function (err, result) {
            console.log("\n  In order to interact with the Pocket service you have to visit this URL to obtain an access token.\n\n  " + colors.green + result.redirectUrl + colors.reset + " \n");

            process.stdout.write("  Waiting here until you visited the URL ...");

            indicator = setInterval(function () {
                process.stdout.write(".");
            }, 500);

            code = result.code;
        });
    }

    function isValidUrl (url) {
        return (/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/).test(url);
    }

    function end () {
        process.exit();
    }

    cli.version(pkg.version);

    cli
        .command("init")
        .description("Configuration assistant")
        .action(function () {
            authentication();
        });

    cli
        .command("add [url]")
        .description("Adds a website into your pocket")
        .action(function (url) {
            var configuration = config.load();

            if (!configuration) {
                authentication();
            } else if (isValidUrl(url)) {
                pocket.add(configuration, url, function (err) {
                    if (err) {
                        console.log("\n " + colors.red + "✖ Outsch. Saving URL was not successful.\n" + colors.reset);

                        return;
                    }

                    console.log("\n " + colors.green + "✓ Saved URL.\n" +  colors.reset);

                    end();
                });
            } else {
                console.log("\n " + colors.red + "✖ Not a valid URL.\n" + colors.reset);

                end();
            }
          });

    cli.parse(process.argv);
}());