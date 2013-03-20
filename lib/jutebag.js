/*
 * jutebag
 *
 * A command line interface for Pocket a.k.a. getpocket.com a.k.a. Read It Later
 *
 * Copyright(c) 2013 André König <andre.koenig@gmail.com>
 * MIT Licensed
 *
 */

var fs   = require("fs"),
	path = require("path");

;(function () {
	"use strict";

	var jutebag = module.exports,
		commandModules;

	jutebag.commands = [];

	// Add commands. Read all files from the current directory
	// and require them if they do not match the current module ('jutebag.js')
	commandModules = fs.readdirSync(__dirname);
	commandModules.forEach(function (commandModule) {
		var stats = fs.statSync(__dirname + path.sep + commandModule);

		if (!stats.isDirectory() && path.extname(commandModule) === ".js" && __filename.indexOf(commandModule) === -1) {
			jutebag.commands.push(require('./' + commandModule.replace(path.extname(commandModule), "")));
		}
	});	
})();