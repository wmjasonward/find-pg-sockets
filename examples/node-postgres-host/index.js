'use strict';

/**
 ~Slightly contrived~ example showing how to use find-pg-sockets
 with node-postgres to connect to the local postgres server without
 hardcoding the socket file directory, or setting PG_HOST

 For this example to work, this must be run as an operating system
 user with access to a postgres database with the same
 name as the user on the same system over the unix domain socket.

 It is possible to also specify user, password, database, etc for
 the client.

 */

var dirname = require('path').dirname;

var PgClient = require('pg').Client;
var findpgsockets = require('../../index.js');

function connectToPostgres(socketDir) {
  console.log('Attempting to connect to postgres using socketDir (' + socketDir + ')');
  var client = new PgClient({
    host: socketDir
  });
  var connected = true;
  client.connect(function(err) {
    if (err) {
      console.log(err);
      connected = false;
    }
  });

  if (connected) {
    client.query('SELECT current_database() as db', function(err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully connected to database (' + res.rows[0].db + ')');
      }
      client.end();
    });
  }
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
