# find-pg-sockets
> Small utility to locate the PostgreSQL unix domain socket file(s) on *nix and bsd hosts.

This utility executes 'netstat -a' and looks for any .s.PGSQL.nnnn socket files. It is primarily intended to be used by developers that have Postgres running on their local machine and want to connect to the Postgres server (using node-postgres) over the local domain socket, rather than tcp.

## Installation

OS X & Linux:

```sh
npm install find-pg-sockets --save
```

Windows:

This is not for Windows.

## Usage example


## Development setup

Node >= v6 is required for running tests.

```
npm test
```

## Release History

* 0.0.2
    * Removed .idea files from npm package
* 0.0.1
    * Works as expected, needs better release docs and samples
