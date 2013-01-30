



var Pid = module.exports = function(config) {
    this.config = config;
};


Pid.prototype.downgrade = function (cb) {
  if(process.getuid() === 0){
    process.setgid(this.config.gid || 'knott');
    process.setuid(this.config.uid || 'knott');
  }

  if(typeof cb === 'function'){
    cb(process.getuid(), process.getgid());
  }
};
