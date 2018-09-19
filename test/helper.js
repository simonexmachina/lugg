var writer = require('flush-write-stream');
var split = require('split2');

function hasChinding(log, name, value) {
  return Object.getOwnPropertySymbols(log).some(symbol => {
    var matches = false;
    try {
      matches = log[symbol].match(',"' + name + '":"' + value + '"');
    }
    finally {
      return matches;
    }
  });
}

function once(emitter, name) {
  return new Promise((resolve, reject) => {
    if (name !== 'error') emitter.once('error', reject);
    emitter.once(name, (...args) => {
      emitter.removeListener('error', reject);
      resolve(...args);
    });
  });
}

function sink(func) {
  var result = split(JSON.parse);
  if (func) result.pipe(writer.obj(func));
  return result;
}

module.exports = { hasChinding, sink, once };
