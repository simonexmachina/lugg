# lugg

[![Build Status](https://travis-ci.org/aexmachina/lugg.png)](https://travis-ci.org/aexmachina/lugg)

A simple logging module that uses [`bunyan`](https://github.com/trentm/node-bunyan) and draws inspiration from TJ Hollowaychuk's [`debug`](https://github.com/visionmedia/debug).

Logging is a universal concern in most programs, and `lugg` aims to make the common usage pattern as simple as possible.

#### Based on `bunyan`

> Manifesto: Server logs should be structured. JSON's a good format. Let's do that. A log record is one line of `JSON.stringify`'d output. 

At first glance, logging appears to be an isolated concern, but on closer inspection you can see that it intersects with analytics, error handling, debugging and disaster recovery. The `bunyan` module provides a great solution to address all of these concerns.  

`lugg` simplifies the common use case, and aims to be really simple to use.

#### Inspired by `debug`

`lugg` also provides the ability to control debug output using a `DEBUG` environment variable, and you can even access debug and trace output from a running process using `bunyan`'s runtime log snooping feature (using DTrace).

## Example Usage

```
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

Read [the source](https://github.com/aexmachina/lugg/blob/master/index.js) (it's tiny) and refer the [`bunyan` docs](https://github.com/trentm/node-bunyan#features) for more info. 

## Controlling Log Output

The call to `lugg.init()` takes an option hash, which is passed to `bunyan.createLogger()` to create a "root logger". All loggers returned from `lugg` are children of this root logger, so they inherit whatever settings you provide to `init()`.

See the docs for `bunyan` for more info about the supported options. `lugg` will provide a name of "app" if no `name` is provided.

## Controlling Debug Output

The log level can be manipulated using the `DEBUG` environment variable, using the same approach as the `debug` module:

```shell
$ DEBUG=* node app.js # print all debug output
$ DEBUG=app:* node app.js # print debug output from your app
$ DEBUG=foo,express:* node app.js # print debug output from foo and express
$ DEBUG=*,-foo node app.js # print all debug output except foo
```

As loggers are created, if they have a name that matches this environment variable then they will have their `level` set to `debug`. You can also manipulate this programmatically using `lugg.debug()`:

```
lugg.debug('app:foo'); // debug messages from app:foo
lugg.debug('app:foo:'); // debug messages from app:foo
```

Be aware this doesn't change any loggers that have already been created.

## Output

`bunyan` writes logs to stdout in JSON format, so pipe the output through the `bunyan` CLI to get logs in a more human readable format:

    node app | bunyan --output short

The [`bunyan` CLI](https://github.com/trentm/node-bunyan#cli-usage) also provides features for filtering your log output.
