
/**
 * Module dependencies.
 */

var bunyan = require('bunyan'),
    debug = require('./lib/debug-env'),
    defaults = require('defaults'),
    fmt = require('util').format,
    isDebugEnabled = require('./lib/debug-env').enabled,
    rootLogger,
    rootName;

/**
 * Create a logger instance.
 */

function createLogger(name, options, simple) {
  if (!rootLogger) {
    throw new Error('No root logger available.');
  }

  if (!name) {
    return rootLogger;
  }

  options = defaults(options, {
    module: name,
    level: bunyan.FATAL + 1
  });

  if (isDebugEnabled(fmt('%s:%s', rootName, name))) {
    options.level = 'debug';
  }

  return rootLogger.child(options, !!simple);
}

/**
 * Export `createLogger`.
 */

module.exports = createLogger;

/**
 * Export `init`.
 */

module.exports.init = function(options) {
  options = defaults(options, {
    name: 'app'
  });

  rootLogger = bunyan.createLogger(options);
  rootName = rootLogger.fields.name;

  return createLogger;
};

/**
 * Export `debug`.
 */

module.exports.debug = debug.add;
