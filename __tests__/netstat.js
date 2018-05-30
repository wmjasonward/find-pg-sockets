'use strict';

jest.mock('child_process');

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var findpgsocket = require('../index.js');

var netstatFixturesDir = path.resolve(__dirname, '../__fixtures__/netstats/');

/**
 * defines our test files (captured netstat outputs) and expected results
 * @type {Array}
 */
var tests = [
  {
    name: '"netstat -a" on fedora27 with postgres listening on two sockets',
    file: 'fedora27-001-positive',
    results: [
      '/var/run/postgresql/.s.PGSQL.5432',
      '/tmp/.s.PGSQL.5432',
    ],
  },
  {
    name: '"netstat -a" on macosx with postgres listening on one socket',
    /* 'macosx el-capitan 10.11.6', */
    file: 'macosx-001-positive',
    results: [
      '/tmp/.s.PGSQL.5432',
    ],
  },
];


/** old school loopity :) gotta love pre es6 */
for (var t = 0; t < tests.length; t++) {
  var curtest = tests[t];

  test(curtest.name, (function(ct) {
    return function(done) {
      // setup our exec mock
      exec.mockImplementationOnce(function (cmd, opts, cb) {
        cb(null, fs.readFileSync(path.join(netstatFixturesDir, ct.file)).toString(), '');
      });

      findpgsocket(function (err, sockets) {
        expect(sockets.sort()).toEqual(ct.results.sort());
        done();
      });
    }
  })(curtest));
}
