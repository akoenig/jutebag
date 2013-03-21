/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var api    = require("./utils/api"),
    colors = require('colors'),
    http   = require("http"),
    shell  = require("./utils/shell");

module.exports = function (configuration) {
    "use strict";

    var initCmd = {};

    Object.defineProperties(initCmd, {
        "id": {
            enumerable: true,
            writable: false,
            value: 1
        },
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
                var requestToken,
                    indicator,
                    host,
                    port;

                host = "localhost";
                port = 8099;

                http.createServer(function (req, res) {
                    if (req.url === "/") {
                        api.getAccessToken(requestToken, function (err, accessToken) {
                            if (err) {
                                console.log(("\n ✖ Outsch. Problem while requesting access token: \n\n   " + err + "\n").red);
                            } else {
                                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf8'});
                                res.end("✓ Cool! Now you can use your 'jutebag'. Have fun!");

                                configuration.set("accessToken", accessToken);
                                configuration.save();

                                console.log("\n\n  ✓ Done! Have fun.\n".green);

                                clearInterval(indicator);
                            }

                            shell.exit(+(!!(err)));
                        });
                    }
                }).listen(port, host);

                api.getRequestToken("http://" + host + ":" + port, function (err, result) {
                    if (err) {
                        console.log(("\n ✖ Outsch. Problem while determining the request token: \n\n   " + err + "\n").red);

                        shell.exit(1);
                    }

                    console.log(("\n  In order to interact with the Pocket service you have to visit this URL to obtain an access token.\n\n  " + result.redirectUrl + " \n").green);

                    process.stdout.write("  Waiting here until you visited the URL ...");

                    indicator = setInterval(function () {
                        process.stdout.write(".");
                    }, 500);

                    requestToken = result.code;
                });
            }
        }
    });

    return initCmd;
};