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
        http   = require("http"),
        pkg    = require("./package.json"),
        pocket = require("./lib/pocket");

    colors.red   = "\u001b[31m";
    colors.reset = "\u001b[0m";
    colors.green = "\u001b[32m";

    function assistant () {
        var code,
            server,
            sockets = [];

        server = http.createServer(function (req, res) {
            if (req.url === "/") {
                pocket.getAccessToken(code, function (err, accessToken) {
                    var i;

                    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
                    res.end('✓ Cool! Now you can use the pocket-cli. Have fun!');

                    config.save({
                        accessToken: accessToken
                    });

                    console.log("\n " + colors.green + "✓ Done! Have fun.\n" +  colors.reset);

                    server.close();

                    for (i = 0; i < sockets.length; i++) {
                        sockets[i].destroy();
                    }

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
            console.log("\n  Please visit the following URL for obtaining an access token. Waiting here until you visited the URL. \n\n  " + result.redirectUrl + " \n");

            code = result.code;
        });
    }

    function isValidUrl (url) {
        return (/(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/).test(url);
    }

    function end () {
        process.exit();
    }

    if (!config.exists()) {
        console.log("\n " + colors.red + "✖ Configuration file is not available. Talking with Pocket. Just a second ...\n" + colors.reset);
    }

    cli.version(pkg.version);

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
            var configuration = config.load();

            if (!configuration) {
                assistant();
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