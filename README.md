# jutebag

A command line interface for the incredible [Pocket](http://getpocket.com) a.k.a. getpocket.com a.k.a. Read It Later service.

## Installation

    $ npm install -g jutebag

## Commands

**init**

    $ jb init

The Pocket authentication process. In order to interact with the Pocket service we have to do a handshake first.

**add [url]**

    $ jb add http://joyent.com/blog/watch-it-wednesdays-where-node-goes-from-here

Adds the given URL to your reading list (you have to check this URL if you are interested in [Node.js](http://nodejs.org) ;)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)

## Author

Copyright (c) 2013, [André König](http://lochkartenstanzer.de) ([Google+](http://profile.lochkartenstanzer.de)) (andre.koenig -[at]- gmail [*dot*] com)

## Changelog

### v0.1.1 (20130318)

* Functionality for defining tags while adding a website (--tags or -t).
* Exception handling for connection problems.

### v0.1.0 (20130318)

* Functionality for adding websites to your reading list.
* Initial version