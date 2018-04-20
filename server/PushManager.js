var FCM = require('fcm-node');
var Parse = require('parse/node');
var FCM_KEY= 'AAAAcmJLzBY:APA91bF2x1IhD0HipgY7MY3ovle_fkizJEXJvK8s2kEAP-JPBa31i2zViSAT3OOD3EN84r4MoHat_2llwXiI67y7VkR760oSoSyzcucptu6VRaLY_lJTTYAXQE3Rjp43H_5empiNyjWj'


class PushManager{
  constructor(){
    this.fcm = new FCM(FCM_KEY);
   
    var Push = Parse.Object.extend("Push");
    var query = new Parse.Query(Push);

    query.find({
      success: results => {
        console.log(results)
        res.success({code: 100});
      },
      error: (err) => {
        console.log(err)
        res.error();
      }
    })
    
  }

}

module.exports = PushManager;