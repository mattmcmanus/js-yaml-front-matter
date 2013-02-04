var jsYaml = require('js-yaml')
  , path = require('path')
  , fs = require('fs');

var re = /^-{3}([\w\W]+)(-{3})([\w\W]*)*/;

jsYaml.hasFront = function (text) {
  return re.test(text);
};

jsYaml.parse = function (text, name) {
  name = name || '__content';
  if (!this.hasFront(text)) {
    return new Error('Error: text does not follow js-yaml-front syntax when trying to parse: \n' + text);
  }
  var results = re.exec(text);
  var conf = jsYaml.load(results[1]);
  if(typeof results[3] !== 'undefined') conf[name] = results[3];
  return conf;
};

jsYaml.loadFront = function (context, name) {
  var contents;
  if(fs.existsSync(context)) {
    contents = fs.readFileSync(context, 'utf8');
    if (contents instanceof Error) return contents;
    return jsYaml.parse(contents, name);
  } else if (Buffer.isBuffer(context)) {
    return jsYaml.parse(context.toString(), name);
  } else {
    return jsYaml.parse(context, name);
  }
  return false;
};

module.exports = jsYaml;