/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

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
        return this.data[attr];
    },

    set : function (attr, value) {
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
        return {
            is : function (value) {

            }
        }
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