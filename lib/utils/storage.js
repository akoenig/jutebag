/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

 /* global require: true, modules: true */ 

var underscore = require("underscore");

;(function () {
    "use strict";

    var fs   = require("fs"),
        path = require("path");

    function _extend(obj, target) {
        var o;

        for (o in obj) {
            target[o] = obj[o];
        }

        return target;
    }

    function Store (path, data) {
        this.path = path;
        this.data = data;
    }

    Store.prototype = {

        exists : function () {
            return this.data;
        },

        load : function () {
            var config;

            try {
                this.data = require(this.path);
            } catch (e) {}
        },

        save : function () {
            // Check if the directory in which the store
            // should be saved exists. If not create.
            var directory = path.dirname(this.path),
                exists = fs.existsSync(directory);

            if (!exists) {
                fs.mkdirSync(directory);
            }

            fs.writeFileSync(this.path, JSON.stringify(this.data));
        },

        get : function (attr) {
            if (!attr) {
                return _extend(this.data, {});
            } else {
                return this.data[attr];
            }
        },

        set : function (attr, value) {
            this.data = this.data || {};

            // If the attr parameter is an object, we have
            // to replace the complete "data" property with
            // the new data (e.g. store.set({foo: "bar"})); )
            if (typeof attr === "object") {
                this.data = _extend(attr, {});
            } else if (value) {
                if (typeof value === "object") {
                    this.data[attr] = _extend(value, {});
                } else {
                    this.data[attr] = value;
                }
            }
        },

        where : function (attr) {
            var that = this,
                results = this.data;

            return {
                is : function (value) {
                    var id,
                        filteredResults = {};

                    for (id in results) {
                        if (results.hasOwnProperty(id)) {
                            // 1. Layer properties
                            //
                            //     e.g.: {id: value}
                            //
                            if (id === attr && results[id] === value) {
                                filteredResults[id] = results[id];
                            // 2. Layer properties (if value is also an object)
                            //
                            //    e.g.: {id: {attr: value}}
                            //
                            } else if (results[id][attr] !== undefined && results[id][attr] === value) {
                                filteredResults[id] = results[id];
                            }
                        }
                    }

                    results = filteredResults;

                    return this;
                },
                and : function (prop) {
                    attr = prop; // Changed the 'attr' param in where function.

                    return this;
                },
                matches : function (list) {
                    var id,
                        filterables,
                        filteredResults = {};

                    list = underscore.toArray(list);

                    if (list.length > 0) {
                        list = list.sort(function (a, b) {
                            return a - b;
                        });
                        list = list.join("");
                        list = list.replace(" ", "");

                        for (id in results) {
                            filterables = undefined;

                            if (results.hasOwnProperty(id)) {
                                // 1. Layer properties
                                //
                                //     e.g.: {id: value}
                                //
                                if (id === attr && results[id]) {
                                    filterables = results[id];
                                // 2. Layer properties (if value is also an object)
                                //
                                //    e.g.: {id: {attr: value}}
                                //
                                } else if (results[id][attr]) {
                                    filterables = results[id][attr];
                                }

                                if (filterables) {
                                    if (underscore.isObject(filterables)) {
                                        filterables = underscore.keys(filterables);
                                    }

                                    filterables = filterables.sort(function (a, b) {
                                        return a - b;
                                    });

                                    filterables = filterables.join("");

                                    if (filterables === list) {
                                        filteredResults[id] = results[id];
                                    }
                                }
                            }
                        }

                        results = filteredResults;
                    }

                    return this;
                },
                end : function () {
                    return results;
                }
            };
        }
    };

    module.exports = (function () {
        var stores = {};

        return {
            init : function (meta) {
                var store;

                for (store in meta) {
                    if (meta.hasOwnProperty(store)) {
                        stores[store] = new Store(meta[store]);
                    }
                }
            },
            getStore : function (type) {
                return stores[type];
            }
        };
    })();
})();