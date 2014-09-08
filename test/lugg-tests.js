var lugg = require('..'),
    debug = require('../lib/debug-env.js'),
    assert = require('assert');

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
    assert(log.streams[0].level == 30);
  });
  it('can specify the log level', function() {
    lugg.init({
      name: 'name',
      stream: process.stderr,
      level: 'error'
    });
    var log = lugg();
    assert.equal(log.level(), 50);
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
    assert.equal(log.level(), 50);
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
    assert.equal(lugg('test').level(), 20, 'app:test is debug');
    assert.equal(lugg('foo').level(), 30, 'app:foo is not debug');
  });
  it('app:*', function() {
    debug.parse('app:*');
    assert.equal(lugg('test').level(), 20, 'app:test is debug');
    assert.equal(lugg('foo').level(), 20, 'app:foo is debug');
  });
  it('app:*,-app:foo', function() {
    debug.parse('app:*,-app:foo');
    assert.equal(lugg('test').level(), 20);
    assert.equal(lugg('foo').level(), 30);
  });
  it('using debug function', function() {
    lugg.debug('app:foo');
    assert.equal(lugg('not').level(), 30, 'not');
    assert.equal(lugg('foo').level(), 20, 'debug foo');
    lugg.debug('app:foo:disabled', false);
    assert.equal(lugg('foo:disabled').level(), 30, 'disabled');
    lugg.debug('-app:foo:minus');
    assert.equal(lugg('foo:minus').level(), 30, 'minus');
  });
});
