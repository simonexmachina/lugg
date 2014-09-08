var bunyan = require('bunyan'),
    debug = require('./lib/debug-env'),
    debugEnabled = require('./lib/debug-env').enabled,
    rootLogger, rootName, loggers = [];

var exports = module.exports = createLogger;

function createLogger(name, options) {
  if (!rootLogger) {
    throw new Error('No root logger - did you forget to call lugger.init()');
  }
  if (name) {
    var opts = options || {},
        simple = !!options; // enable bunyan's fast path for child creation
    if (debugEnabled(rootName + ':' + name)) {
      opts.level = 'debug';
    }
    opts.module = opts.module || name;
    return rootLogger.child(opts, simple);
  }
  else {
    return rootLogger;
  }
}

exports.init = function(options) {
  var opts = options || {};
  rootName = opts.name = opts.name || 'app';
  rootLogger = bunyan.createLogger(opts);
  return createLogger;
};

exports.debug = debug.add;
