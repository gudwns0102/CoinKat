var FCM = require('fcm-node');
var mongoose = require('mongoose');
var FCM_KEY= 'AAAAcmJLzBY:APA91bF2x1IhD0HipgY7MY3ovle_fkizJEXJvK8s2kEAP-JPBa31i2zViSAT3OOD3EN84r4MoHat_2llwXiI67y7VkR760oSoSyzcucptu6VRaLY_lJTTYAXQE3Rjp43H_5empiNyjWj'


class PushManager{
  constructor(){
    this.fcm = new FCM(FCM_KEY);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/CoinKat')
    .then(() => console.log('MongoDB connection Success'))
    .catch(e => console.log(e));

    
    const pushSchema = new mongoose.Schema({
      exchange: {type: String, required: true},
      name: {type: String, required: true},
      upPrice: {type: Number, required: true},
      downPrice: {type: Number, required: true},
      _p_parent: {required: true}
    },
    {
      timeStamp: true
    });

    pushSchema.statics.findAll = () => this.find({});

    const Push = mongoose.model('Push', pushSchema);

    Push.findAll();
  }

}

module.exports = PushManager;