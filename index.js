'use strict';

var exec = require('child_process').exec;

var pgsql_sockets_regex = /\/.*\.s.PGSQL\.\d{1,5}/g;

/**
 * Returns an array of socket files from the result of
 * netstat -lx
 *
 * @param stdin
 * @returns {Array}
 */
function extractSocketsFromNetstatResult(stdout) {
  var paths = stdout.match(pgsql_sockets_regex);
  // remove dups, but keep order (event though order doesn't matter for us)
  // https://stackoverflow.com/a/15868720/358977
  return paths ? paths.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]): [];
}


function getFromNetstat(cb) {
  exec('netstat -a', {}, function(err, stdout, stderr) {
    if (err) {
      err.stdout = stdout;
      err.stderr = stderr; // should probably just go on debug
      cb(err);
    } else {
      cb(null, extractSocketsFromNetstatResult(stdout));
    }
  });
}

// our 'findpgsockets' function
// currently just uses getFromNetstat
module.exports = function(cb) {
  getFromNetstat(cb);
};
