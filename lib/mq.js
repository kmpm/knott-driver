
var mqtt = require('mqtt'),
  os = require('os'),
  EventEmitter = require('events').EventEmitter,
  util = require('util'),
  log = require('..').log;

// driver, instance, (device), property
var DEVICE_TEMPLATE="/config/%s/%s/device/%s/%s";
var SUBSCRIBE = "/config/%s/%s/#";

var Mq = module.exports = function (drivername, instancename, host, port) {
  EventEmitter.call(this);
  if (typeof drivername === 'undefined') {
    throw new TypeError('drivername is undefined');
  }
  this.drivername = drivername;
  this.instancename = typeof instancename === 'undefined' ? os.hostname() : instancename;
  var self = this;
  var client = self.client = mqtt.createClient(port, host, function (err, client) {
    if (err) {
      this.emit('error', err);
      return;
    }
    setTimeout(function () {
      client.connect({keepalive: 30000});
    },500);
  });
  client.on('connack', function(){self._connack.call(self, arguments);});
  client.on('close', function(){log.info('Closed');});
  client.on('error', function(err){log.error('Error', err);});
  client.on('publish', function () {self.receive.call(self, arguments);});
  client.on('suback', function () {self._suback.call(self, arguments);});
};

util.inherits(Mq, EventEmitter);

Mq.prototype._connack = function (packet) {
  var self = this;
  var topic = util.format(SUBSCRIBE, this.drivername, this.instancename);
  log.debug("subscribing to config from '%s'", topic);
  this.client.subscribe({topic:topic});
  //this.heartbeat();
  //setInterval(function () {
  //  self.heartbeat.call(self);
  //}, 5000);
  this.emit('ready', this);
};

Mq.prototype._suback = function(packet){
  log.debug("suback", packet);  
};

Mq.prototype.receive = function (packets) {
  var i, packet;
  for (i in packets) {
    if(packets.hasOwnProperty(i)){
      packet = packets[i];
      var m = this.parseTopic(packet.topic);

      if (m !== null){
        this.emit('config', m.device, m.property, packet.payload);
      }
    }
  }
};

Mq.parseTopic = function (topic) {
  var r = topic.split('/');
   
  return {driver: r[2],
    instance: r[3],
    device: r.slice(5,r.length-1).join('/'),
    property: r[r.length-1]
  };
};

Mq.prototype.publish = function (topic, payload) {
  if(typeof payload !== 'string') {
    payload = payload.toString();
  }
  log.debug('publish', topic, 'payload=', payload);
  this.client.publish({topic: topic, payload: payload, retain: true});
};


Mq.prototype.set = function (device, value, payload) {
  var topic = util.format(DEVICE_TEMPLATE,
    this.drivername,
    this.instancename,
    device,
    value);
  this.publish(topic, payload.toString());
};

