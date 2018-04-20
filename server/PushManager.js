var FCM = require('fcm-node');
var Parse = require('parse/node');
var FCM_KEY= 'AAAAcmJLzBY:APA91bF2x1IhD0HipgY7MY3ovle_fkizJEXJvK8s2kEAP-JPBa31i2zViSAT3OOD3EN84r4MoHat_2llwXiI67y7VkR760oSoSyzcucptu6VRaLY_lJTTYAXQE3Rjp43H_5empiNyjWj'


class PushManager{
  constructor(){
    this.fcm = new FCM(FCM_KEY);
  
  }

  async updatePush(){
    var Push = Parse.Object.extend("Push");
    var query = new Parse.Query(Push);
    var pushes = await query.find();

    console.log(pushes);
  }
}

module.exports = PushManager;