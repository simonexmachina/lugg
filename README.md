# lugg

[![Build Status](https://travis-ci.org/aexmachina/lugg.png)](https://travis-ci.org/aexmachina/lugg)

A simple logging module that uses [pino](https://github.com/pinojs/pino) and draws inspiration from TJ Hollowaychuk's [debug](https://github.com/visionmedia/debug).

Logging is a universal concern in most programs, and `lugg` aims to make the common usage pattern as simple as possible.

#### Based on pino

> Manifesto: Server logs should be structured. JSON's a good format. Let's do that. A log record is one line of `JSON.stringify`'d output. 

At first glance, logging appears to be an isolated concern, but on closer inspection you can see that it intersects with analytics, error handling, debugging and disaster recovery. The pino module provides a great solution to address all of these concerns.

`lugg` simplifies the common use case, and aims to be really simple to use.

#### Inspired by debug

`lugg` also provides the ability to control debug output using a `DEBUG` environment variable.

## Example Usage

```javascript
// call init once in your program
require('lugg').init();

// then in foo.js
var log = require('lugg')('foo');
log.info('doing stuff');
log.warn({foo: 'bar'}, 'something %s', 'interesting');
log.error(new Error('blah'), 'something %s', 'bad');
log.debug('this will not be output'); // set DEBUG=app:foo to see debug output from this logger
```

Each argument you pass is logged as-is, up to the first string argument, which is formatted using `util.format()` to provide string interpolation of any subsequent arguments.

Read [the source](https://github.com/aexmachina/lugg/blob/master/index.js) (it's tiny) and refer the [pino docs](http://getpino.io/#/docs) for more info.

## Controlling Log Output

You can control the output of lugg using the `level` option:

```javascript
require('lugg').init({level: 'warn'}); // show only warnings and higher
```

The logging level you provide in the call to `.init()` would typically come
from your local configuration (eg. `warn` in production, `info` in
development).

You can also manipulate the logging level for specific loggers at runtime,
without having to modify your configuration, using an environment variable (see
[Controlling Debug Output](#controlling-debug-output) below).

The call to `lugg.init()` takes an option hash, which is passed to
`pino.child()` to create a "root logger". All loggers returned from
`lugg` are children of this root logger, so they inherit whatever settings
you provide to `init()`.

See the docs for pino for more info about the supported options. `lugg` will
provide a name of "app" if no `name` is provided.

## Controlling Debug Output

The log level can be manipulated using the `DEBUG` environment variable, using
the same approach as the debug module:

```shell
$ DEBUG=* node app.js # print all debug output
$ DEBUG=app:* node app.js # print debug output from your app
$ DEBUG=foo,express:* node app.js # print debug output from foo and express
$ DEBUG=*,-foo node app.js # print all debug output except foo
```

As loggers are created, if they have a name that matches this environment variable then they will have their `level` set to debug. You can also manipulate this programmatically using `lugg.debug()`:

```javascript
lugg.debug('app:foo'); // debug messages from app:foo
lugg.debug('app:foo:'); // debug messages from app:foo
```

Be aware this doesn't change any loggers that have already been created.

## Output

pino writes logs to stdout in JSON format, so pipe the output through the pino CLI to get logs in a more human readable format:

```shell
node app.js | pino
```
