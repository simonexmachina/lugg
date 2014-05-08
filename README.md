# lugg

A simple logging module that uses [bunyan](https://github.com/trentm/node-bunyan) and draws inspiration from TJ Hollowaychuk's [debug](https://github.com/visionmedia/debug).

Logging is a universal concern in the vast majority of programs and I wanted to make it as simple as possible. Logging initially appears to be a focused concern, but on closer inspection you can see that it intersects with tracing, analytics, error handling, debugging, and disaster recovery. Bunyan provides the perfect solution to address all of these concerns, and lugg aims to make it really simple to use.

Lugg also provides the ability to control debug output using a `DEBUG` environment variable, and you can even access debug and trace output from a running process using bunyan's runtime log snooping feature (using DTrace).

## Example Usage

```javascript
// call init once
require('lugg').init();

// then in foo.js
var log = require('lugg')('foo');
log.debug('this will not be output'); // set DEBUG=app:foo to see debug output from this logger
log.info('doing stuff');
log.warn({foo: 'bar'}, 'something %s', 'intersting');
log.error(new Error('blah'), 'something %s', 'bad');
```

lugg uses bunyan, which writes your log output as JSON. Each argument you pass is logged as-is, up to the first string argument, which is formatted with `util.format()` using each of the subsequent arguments for string interpolation.

Read [the source](https://github.com/aexmachina/lugg/blob/master/index.js) (it's tiny) and consult the [bunyan docs](https://github.com/trentm/node-bunyan#features) for more info. 

## Controlling Log Output

The call to `lugg.init()` takes an option hash, which is passed to `bunyan.createLogger()` to create a "root logger". All loggers returned from `lugg` are children of this root logger, so they inherit whatever settings you provide to `init()`.

See the docs for `bunyan` for more info about the supported options. `lugg` will provide a name of "app" if no `name` is provided.

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
