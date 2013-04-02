/*global describe, it */
var assert = require('assert');


describe("should require", function () {
  it('log', function () {
    var l = require('../lib/log');
  });
  it('mq', function () {
    var m = require('../lib/mq');
  });
  it('pid', function () {
    var p = require('../lib/pid');
  });
  it('index', function () {
    var i = require('../');
  });

});
