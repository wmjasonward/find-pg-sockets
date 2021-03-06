# find-pg-sockets

> Small utility to locate the PostgreSQL unix domain socket file(s) on *nix and bsd hosts.

This utility executes 'netstat -a' and looks for any PostgreSQL server sockets.
It is primarily intended to be used by developers that have Postgres running on
their local machine and want to connect to their local Postgres server (using node-postgres)
over the domain socket, rather than tcp.

This is standalone part of a larger framework I'm working on releasing.

## Installation

OS X & Linux:

```sh
npm install find-pg-sockets --save
```

Windows:

This is not for Windows.

## Usage example

This example can be found in the 'examples/node-postgres-host' directory in the repo:

```
'use strict';

/**
 ~Slightly contrived~ example showing how to use find-pg-sockets
 with node-postgres to connect to the local postgres server without
 hardcoding the socket file directory, or setting PG_HOST

 For this example to work, it must be run as an operating system
 user with access to a postgres database with the same
 name as the user on the same system over the unix domain socket.

 */

var dirname = require('path').dirname;

var PgClient = require('pg').Client;
var findpgsockets = require('find-pg-sockets');

function connectToPostgres(socketDir) {
  console.log('Attempting to connect to postgres using socketDir (' + socketDir + ')');
  var client = new PgClient({
    host: socketDir
  });

  client.connect(function(err) {
    if (err) {
      console.log(err);
    } else {
      client.query('SELECT current_database() as db', function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully connected to database (' + res.rows[0].db + ')');
        }
        client.end();
      });
    }
  });
}

findpgsockets(function(err, sockets) {
  if (err) {
    console.log(err);
  } else {
    if (sockets.length > 0) {
      // pg needs the socket dir to connect that way
      var socketDir = dirname(sockets[0]);
      connectToPostgres(socketDir);
    } else {
      console.log('no active socket files found - is postgres running?');
    }
  }
});


```

## Development setup

Node >= v6 is required for running tests.

```
npm test
```

## Release History

* 0.0.7
    * Updated dependencies to upstream vulnerability
* 0.0.6
    * Updated dev dependencies due to vulnerability in merge
* 0.0.5
    * Fix callback issue in example program
* 0.0.4
    * Version bump with some comment changes for clarification
* 0.0.3
    * Added example usage to repo
* 0.0.2
    * Removed .npmignore and included "files" in package.json
* 0.0.1
    * Works as expected, needs better release docs and samples
