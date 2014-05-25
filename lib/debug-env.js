var names, skips;

exports.update = function() {
  exports.parse(process.env.DEBUG || "");
};

exports.parse = function(str) {
  names = [];
  skips = [];
  str.split(/[\s,]+/).forEach(function(name){
    name = name.replace('*', '.*?');
    if (name[0] === '-') {
      skips.push(new RegExp('^' + name.substr(1) + '$'));
    } else {
      names.push(new RegExp('^' + name + '$'));
    }
  });
};

exports.enabled = function(name) {
  var skipped = skips.some(function(re){
    return re.test(name);
  });
  if (skipped) return false;

  return names.some(function(re){
    return re.test(name);
  });
};

exports.update();
