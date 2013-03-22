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
    markdown  = require("./utils/markdown"),
    path      = require("path"),
    scraper   = require("./utils/scraper"),
    shell     = require("./utils/shell"),
    slug      = require("slug"),
    validator = require("./utils/validator");

module.exports = function (configuration, datastore) {
    "use strict";

    var downloadCmd = {};

    Object.defineProperties(downloadCmd, {
        "id": {
            enumerable: true,
            writable: false,
            value: 6
        },
        "pattern": {
            enumerable: true,
            writable: false,
            value: "download [id]"
        },
        "description": {
            enumerable: true,
            writable: false,
            value: "Downloads a website from your Pocket and saves the content as a Markdown file."
        },
        "exec": {
            enumerable: true,
            writable: false,
            value: function (id) {
                var accessToken,
                    url,
                    elderly;

                function scrape (url) {
                    var filename;

                    console.log("\n   Started scraping: " + url);

                    scraper.convert(url, function (err, article) {
                        // Creating the filename. Current working directory + slug from article title
                        filename = process.cwd() + path.sep + slug(article.title).toLowerCase();

                        if (err) {
                            console.log(("\n ✖ Outsch. Scraping the website was not successful: \n\n   " + err + "\n").red);

                            shell.exit(1);
                        } else {
                            markdown.saveHTML(article.content).to(filename, function (error, filename) {
                                if (error) {
                                    console.log(("\n ✖ Outsch. Error while saving the scraped website: \n\n   " + error + "\n").red);
                                } else {
                                    console.log(("\n ✓ Saved website as Markdown file: " + filename + "\n").green);
                                }

                                shell.exit(+(!!error));
                            });
                        }
                    });
                }

                // URL download feature. Beside the possibility
                // to download a website by an item from the Pocket
                // it is also possible to download a whole website
                // by it's url.
                if (validator.isValidURL(id)) {
                    url = id;

                    scrape(url);
                } else {
                    (function () {
                        var accessToken,
                            elderly;

                        accessToken = configuration.get("accessToken");

                        elderly = datastore.get();

                        api.sync(accessToken, elderly, function (err, data) {
                            if (err) {
                                console.log(("\n ✖ Outsch. Getting the item with the ID " + id + " was not successful: \n\n   " + err + "\n").red);
                                
                                shell.exit(1);
                            } else {
                                url = datastore
                                          .where("item_id")
                                          .is(id)
                                          .end();

                                url = (url[id] || {}).resolved_url;

                                if (!url) {
                                    console.log(("\n ✖ There is no item with the ID " + id + " in your Pocket.\n").red);

                                    shell.exit(1);
                                } else {
                                    scrape(url);                                    
                                }
                            }
                        });
                    })();
                }
            }
        }
    });

    return downloadCmd;
};