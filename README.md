# jutebag

A command line interface for the incredible [Pocket](http://getpocket.com) a.k.a. getpocket.com a.k.a. Read It Later service.

## Installation

    $ npm install -g jutebag

## Commands

### init

    $ jb init

The Pocket authentication process. In order to interact with the Pocket service we have to do a handshake first.

### add

Usage:

	$ jb add [url] [--tags or -t] "comma, separated, tags"

Example:

    $ jb add http://joyent.com/blog/watch-it-wednesdays-where-node-goes-from-here -t "node.js, future"

Adds the given URL to your reading list (you have to check this URL if you are interested in [Node.js](http://nodejs.org) ;). Please note that defining tags is optional.

### unread

Usage:

    $ jb unread [--tags or -t] "comma, separated, tags"

Example:

    $ jb unread -t "node.js" # Lists all unread items with the tag "node.js"

Lists all your unread items. The "tag parameters" are optional.

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

Copyright (c) 2013, [André König](http://lochkartenstanzer.de) ([Google+](http://profile.lochkartenstanzer.de)) (andre.koenig -[at]- gmail [*dot*] com)

## Changelog

### v0.2.0 (20130320)

* New command "jb unread". Lists all unread items.
* Filter function for displaying unread items with a specific tag (e.g. jb unread --tags "node.js")
* New internal command architecture. Sweet!

### v0.1.1 (20130318)

* Functionality for defining tags while adding a website (--tags or -t).
* Exception handling for connection problems.

### v0.1.0 (20130318)

* Functionality for adding websites to your reading list.
* Initial version