# lugg

A simple logging module that uses [bunyan](https://github.com/trentm/node-bunyan) and draws inspiration from TJ Hollowaychuk's [debug](https://github.com/visionmedia/debug).

## Example Usage

```
// call init once
require('lugg').init();

// then in foo.js
var log = require('lugg')('foo');
log.info('doing stuff');
log.warn({foo: 'bar'}, 'something %s', 'intersting');
log.error(new Error('blah'), 'something %s', 'bad');
```

Each argument you pass is logged as-is, up to the first string argument, which is formatted with `util.format()` using each of the subsequent arguments for string interpolation.

Read [the source](index.js) (it's tiny) and consult the [bunyan docs](https://github.com/trentm/node-bunyan#features) for more info. 

## Controlling Log Output

The call to `lugg.init()` takes an option hash, which is passed to `bunyan.createLogger()` to create a 'root logger'. All loggers returned from `lugg` are children of this root logger, so they inherit whatever settings you provide to `init()`.

See the docs for `bunyan` for more info about the supported options. `lugg` will provide a name of 'app' if no `name` is provided.

## Controlling Debug Output

The log level can be manipulated using the `DEBUG` environment variable, using the same approach as the `debug` module:

```shell
$ DEBUG=* node app # print all debug output
$ DEBUG=app:* node app # print debug output from your app
$ DEBUG=foo,express:* node app # print debug output from foo and express
```

## Output

Bunyan writes logs to stdout in JSON format, so pipe the output through `bunyan` to get logs in a more human readable format:

    node app | bunyan --output short
