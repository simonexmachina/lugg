var lugg = require('..'),
    debug = require('../lib/debug-env.js'),
    assert = require('assert'),
    bunyan = require('bunyan');

describe('lugg.init()', function() {
  it('with no arguments', function() {
    lugg.init();
    var log = lugg();
    assert.equal(log.fields.name, 'app');
  });
  it('with arguments', function() {
    lugg.init({
      name: 'theName',
      stream: process.stderr
    });
    var log = lugg();
    assert.equal(log.fields.name, 'theName');
    assert(log.streams[0].stream == process.stderr);
    assert(log.streams[0].level == bunyan.INFO);
  });
  it('can specify the log level', function() {
    lugg.init({
      name: 'name',
      stream: process.stderr,
      level: 'error'
    });
    var log = lugg();
    assert.equal(log.level(), bunyan.ERROR);
  });
});

describe('lugg()', function() {
  beforeEach(function() {
    lugg.init();
  });
  it('returns createLogger on init', function() {
    var log = lugg.init()('test');
    assert.equal(log.fields.module, 'test');
  })
  it('creates loggers', function() {
    var log = lugg('test');
    assert.equal(log.fields.name, 'app');
    assert.equal(log.fields.module, 'test');
  })
  it('accepts options', function() {
    var log = lugg('test', {
      foo: 'bar'
    });
    assert.equal(log.fields.module, 'test');
    assert.equal(log.fields.foo, 'bar');
  });
  it('can set log level', function() {
    var log = lugg('test');
    log.level('error');
    assert.equal(log.level(), bunyan.ERROR);
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
    assert.equal(lugg('test').level(), bunyan.DEBUG, 'app:test is debug');
    assert.equal(lugg('foo').level(), bunyan.INFO, 'app:foo is not debug');
  });
  it('app:*', function() {
    debug.parse('app:*');
    assert.equal(lugg('test').level(), bunyan.DEBUG, 'app:test is debug');
    assert.equal(lugg('foo').level(), bunyan.DEBUG, 'app:foo is debug');
  });
  it('app:*,-app:foo', function() {
    debug.parse('app:*,-app:foo');
    assert.equal(lugg('test').level(), bunyan.DEBUG);
    assert.equal(lugg('foo').level(), bunyan.INFO);
  });
  it('using debug function', function() {
    lugg.debug('app:foo');
    assert.equal(lugg('not').level(), bunyan.INFO, 'not');
    assert.equal(lugg('foo').level(), bunyan.DEBUG, 'debug foo');
    lugg.debug('app:foo:disabled', false);
    assert.equal(lugg('foo:disabled').level(), bunyan.INFO, 'disabled');
    lugg.debug('-app:foo:minus');
    assert.equal(lugg('foo:minus').level(), bunyan.INFO, 'minus');
  });
});
