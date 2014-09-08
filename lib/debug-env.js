var names, skips;

exports.update = function() {
  exports.parse(process.env.DEBUG || '');
};

exports.parse = function(str) {
  names = [];
  skips = [];
  str.split(/[\s,]+/).forEach(function(pattern) {
    exports.add(pattern);
  });
};

exports.enabled = function(name) {
  var skipped = skips.some(function(re) {
    return re.test(name);
  });
  if (skipped) return false;

  return names.some(function(re) {
    return re.test(name);
  });
};

exports.add = function(pattern, enabled) {
  pattern = pattern.replace('*', '.*?');
  if (enabled === undefined) {
    if (pattern[0] === '-') {
      enabled = false;
      pattern = pattern.substr(1);
    }
    else {
      enabled = true;
    }
  }
  (enabled ? names : skips).push(new RegExp('^' + pattern + '$'));
};

exports.update();
