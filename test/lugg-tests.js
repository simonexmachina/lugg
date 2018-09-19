var lugg = require('..'),
    debug = require('../lib/debug-env.js'),
    assert = require('assert'),
    pino = require('pino'),
    hasChinding = require('./helper').hasChinding,
    sink = require('./helper').sink,
    once = require('./helper').once;

var levels = pino.levels.values;
describe('lugg.init()', function() {
  it('with no options', function() {
    var stream = sink();
    lugg.init(stream);
    lugg().info('hello world');
    return once(stream, 'data').then(function (log) {
      assert.equal(log.name, 'app');
    });
  });
  it('with options', function() {
    var stream = sink();
    lugg.init({
      name: 'theName',
      stream: process.stderr
    }, stream);
    lugg().info('hello world');
    return once(stream, 'data').then(function (log) {
      assert.equal(log.name, 'theName');
    });
  });
  it('can specify the log level', function() {
    lugg.init({
      name: 'name',
      stream: process.stderr,
      level: 'error'
    });
    var log = lugg();
    assert.equal(log.level, 'error');
  });
});

describe('lugg()', function() {
  beforeEach(function() {
    lugg.init();
  });
  it('returns createLogger on init', function() {
    var log = lugg.init()('test', {
      foo: 'bar'
    });
    assert(hasChinding(log, 'foo', 'bar'));
  });
  it('creates loggers', function() {
    var log = lugg('test');
    assert(hasChinding(log, 'name', 'test'));
  });
  it('accepts options', function() {
    var log = lugg('test', {
      foo: 'bar'
    });
    assert(hasChinding(log, 'name', 'test'));
    assert(hasChinding(log, 'foo', 'bar'));
  });
});

describe('debug', function() {
  beforeEach(function() {
    debug.parse('');
    lugg.init();
  });
  it('based on environment', function() {
    process.env.DEBUG = 'app:test';
    debug.update();
    assert.equal(lugg('test').level, 'debug', 'app:test is debug');
    assert.equal(lugg('foo').level, 'info', 'app:foo is not debug');
  });
  it('app:*', function() {
    debug.parse('app:*');
    assert.equal(lugg('test').level, 'debug', 'app:test is debug');
    assert.equal(lugg('foo').level, 'debug', 'app:foo is debug');
  });
  it('app:*,-app:foo', function() {
    debug.parse('app:*,-app:foo');
    assert.equal(lugg('test').level, 'debug');
    assert.equal(lugg('foo').level, 'info');
  });
  it('using debug function', function() {
    lugg.debug('app:foo');
    assert.equal(lugg('not').level, 'info', 'not');
    assert.equal(lugg('foo').level, 'debug', 'debug foo');
    lugg.debug('app:foo:disabled', false);
    assert.equal(lugg('foo:disabled').level, 'info', 'disabled');
    lugg.debug('-app:foo:minus');
    assert.equal(lugg('foo:minus').level, 'info', 'minus');
    lugg.debug('*app*');
    assert.equal(lugg('bar').level, 'debug', 'debug bar');
    assert.equal(lugg('biz').level, 'debug', 'debug biz');
  });
});
