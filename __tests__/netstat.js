'use strict';

jest.mock('child_process');

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var findpgsockets = require('../index.js');

var netstatFixturesDir = path.resolve(__dirname, '../__fixtures__/netstats/');

test('it calls cb with Error of expected shape', function(done) {
  exec.mockImplementationOnce(function(cmd, opts, cb) {
    var e = Error('mock exec error');
    cb(e, 'mock stdout content', 'mock stderr content');
  });

  findpgsockets(function(err, sockets) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toMatchObject({
      stdout: 'mock stdout content',
      stderr: 'mock stderr content',
    });
    done();
  });
});


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
    /* test that we only get each socket file once even if it is in netstat -a results
       multiple times due to active client connections
     */
    name: '"netstat -a" on fedora27 with established socket connection (psql)',
    file: 'fedora27-002-positive',
    results: [
      '/var/run/postgresql/.s.PGSQL.5432',
      '/tmp/.s.PGSQL.5432',
    ],
  },
  {
    name: '"netstat -a" on fedora27 without postgres running',
    file: 'fedora27-001-negative',
    results: [],
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


// todo: reimplement with describe.each
for (var t = 0; t < tests.length; t++) {
  var curtest = tests[t];

  test(curtest.name, (function(ct) {
    return function(done) {
      // setup our exec mock
      exec.mockImplementationOnce(function (cmd, opts, cb) {
        cb(null, fs.readFileSync(path.join(netstatFixturesDir, ct.file)).toString(), '');
      });

      findpgsockets(function (err, sockets) {
        expect(sockets.sort()).toEqual(ct.results.sort());
        done();
      });
    };
  })(curtest));
}
