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
      _p_parent: {type: Object, required: true}
    },
    {
      collection: 'Push',
      timeStamp: true
    });

    const userSchema = new mongoose.Schema({
      _id: {type: String, required: true, unique: true}
    },{
      collection: 'User'
    })

    pushSchema.statics.findAll = function(){
      return this.find({});
    }

    userSchema.statics.findById = function(_id){
      return this.find({_id});
    }

    this.Push = mongoose.model('Push', pushSchema);
    this.User = mongoose.model('User', userSchema);

    this.run();
  }

  async run(){
    var pushes = await this.Push.findAll();
    
    var userId = pushes.split('$')[1];

    var user = await this.User.findById(userId);

    console.log(user);
  }

}

module.exports = PushManager;