var pino = require('pino'),
    debug = require('./lib/debug-env'),
    debugEnabled = require('./lib/debug-env').enabled,
    rootLogger, rootName, loggers = [];

var exports = module.exports = createLogger;

function createLogger(name, options) {
  if (!rootLogger) {
    throw new Error('No root logger - did you forget to call lugg.init()');
  }
  if (name) {
    var opts = options || {};
    if (debugEnabled(rootName + ':' + name)) {
      opts.level = 'debug';
    }
    opts.name = opts.name || name;
    return rootLogger.child(opts);
  }
  else {
    return rootLogger;
  }
}

exports.init = function(options) {
  var opts = options || {};
  rootName = opts.name = opts.name || 'app';
  rootLogger = pino(opts);
  return createLogger;
};

exports.debug = debug.add;
