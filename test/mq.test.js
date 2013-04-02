/*global describe, it, before*/

var assert = require('assert'),
  should = require('should');

var driver = require('..');
var Mq = driver.Mq;
//driver.log.level=0;

describe("mq should", function () {
  before(function () {
    this.mq = new Mq('test');
  });
  it('emit ready', function (done) {
    this.mq.on('ready', function () {
      done();
    });
  });

  it('rule a single device', function() {
    var r = Mq.parseTopic( '/config/test/instname/device/1234/alias');
    r.should.have.property('driver', 'test');
    r.should.have.property('instance', 'instname');
    r.should.have.property('device', '1234');
    r.should.have.property('property', 'alias');
  });
  
  it('rule a single 3 level device', function() {
    var r = Mq.parseTopic( '/config/test/instname/device/1234/5678/alias');
    r.should.have.property('driver', 'test');
    r.should.have.property('instance', 'instname');
    r.should.have.property('device', '1234/5678');
    r.should.have.property('property', 'alias');
  });


  it.skip('emit config', function (done) {
    this.timeout(10000);
    var mq = this.mq;
    mq.once('config', function (device, key, payload) {
      key.should.equal('temperature');
      device.should.equal('qwerty');
      payload.should.equal('20');
      done();
    });
    setTimeout(function () {
      mq.set('qwerty', 'temperature', 20 );
    },1000);
  });
});
