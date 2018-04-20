var FCM = require('fcm-node');
var Parse = require('parse/node');
var FCM_KEY= 'AAAAcmJLzBY:APA91bF2x1IhD0HipgY7MY3ovle_fkizJEXJvK8s2kEAP-JPBa31i2zViSAT3OOD3EN84r4MoHat_2llwXiI67y7VkR760oSoSyzcucptu6VRaLY_lJTTYAXQE3Rjp43H_5empiNyjWj'


class PushManager{
  constructor(){
    this.fcm = new FCM(FCM_KEY);

    this.run();
  }

  async updateAllPush(){
    var Push = Parse.Object.extend("Push");
    var query = new Parse.Query(Push);
    this.pushes = await query.find();
  }

  checkAllPush(){
    var pushes = this.pushes;
    pushes.forEach((push, index, array) => this.checkPush(push));
  }

  checkPush(push){
    var parent = push.get('parent');
    var exchange = push.get('exchange');
    var name = push.get('name');
    var upPrice = push.get('upPrice');
    var downPrice = push.get('downPrice');
    
    console.log(parent);
  }

  async run(){
    await this.updateAllPush();
    this.checkAllPush();    
  }
}

module.exports = PushManager;