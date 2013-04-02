var util = require('util');

var LEVELS = ['ERROR', 'WARN', 'INFO', 'DEBUG'];


function createMethod(index) {
  var self = this,
    NAME = LEVELS[index],
    name = NAME.toLowerCase();
  this[name] = function () {
    if (this.level < index) { return; }
    console.log(util.format("%s %s\t %s",
      (new Date()).toJSON(),
      NAME,
      util.format.apply(undefined, arguments)));
  };
}


var Log = module.exports = function () {
  var i;
  this.level = LEVELS.indexOf('DEBUG');
  for (i = 0; i < LEVELS.length; i++) {
    createMethod.call(this, i);
  }
};


