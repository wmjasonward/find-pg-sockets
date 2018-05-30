'use strict';

var exec = require('child_process').exec;

var pgsql_socket_regex = /\/.*\.s.PGSQL\.\d{1,5}/g;

/**
 * Returns an array of socket files from the result of
 * netstat -lx
 *
 * @param stdin
 * @returns {Array}
 */
function extractSocketsFromNetstatResult(stdin) {
  var paths = stdin.match(pgsql_socket_regex);
  // remove dups but keep order (no indication that order matters)
  // https://stackoverflow.com/a/15868720/358977
  return paths.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
}


function getFromNetstat(cb) {
  var m = exec('netstat -a', {}, function(err, stdin, stderr) {
    if (err) {
      err.stdin = stdin;
      err.stderr = stderr; // should probably just go on debug
      cb(err);
    } else {
      cb(null, extractSocketsFromNetstatResult(stdin));
    }
  });
}

// our 'findpgsocket' function
// currently just uses getFromNetstat
module.exports = function(cb) {
  getFromNetstat(cb);
}
