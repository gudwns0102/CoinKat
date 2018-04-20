var FCM = require('fcm-node');
var Parse = require('parse/node');
var FCM_KEY= 'AAAAcmJLzBY:APA91bF2x1IhD0HipgY7MY3ovle_fkizJEXJvK8s2kEAP-JPBa31i2zViSAT3OOD3EN84r4MoHat_2llwXiI67y7VkR760oSoSyzcucptu6VRaLY_lJTTYAXQE3Rjp43H_5empiNyjWj'
var PubSub = require('pubsub-js');
var { setTimeout } = require('timers');

class PushManager{
  constructor(){
    this.fcm = new FCM(FCM_KEY);

    PubSub.subscribe('responseCoinData', (msg, data) => {
      this.coinData = data;
    })

    this.temp = PubSub.subscribe('coinDataReady', () => {
      PubSub.unsubscribe(this.temp);
      console.log('PushManager run!');
      this.run();
    })
  }

  requestCoinData(){
    PubSub.publish('requestCoinData');
  }

  async updateAllPush(){
    var Push = Parse.Object.extend("Push");
    var query = new Parse.Query(Push);
    this.pushes = await query.find();
  }

  async checkAllPush(){
    var pushes = this.pushes;
    for(var i=0; i<pushes.length; i++){
      var push = pushes[i];
      await this.checkPush(push);
      console.log(`index ${i} done!`);
    }

    console.log('All push done... exit');
  }

  async checkPush(push){
    var parent = push.get('parent');
    var exchange = push.get('exchange');
    var name = push.get('name');
    var upPrice = push.get('upPrice');
    var downPrice = push.get('downPrice');

    var { currentPrice } = this.coinData[exchange][name];

    if(currentPrice >= upPrice || currentPrice <= downPrice){
      console.log('push Hit');
      await this.handlePushHit(push);
    } else {
      console.log('push Miss');
    }
  }

  async handlePushHit(push){
    
    var parent = push.get('parent');
    var exchange = push.get('exchange');
    var name = push.get('name');
    var upPrice = push.get('upPrice');
    var downPrice = push.get('downPrice');

    var FCMToken = push.get('FCMToken');
    console.log(FCMToken);
    
    var { currentPrice } = this.coinData[exchange][name];

    var push_data = {
      to: FCMToken,
      notification: {
        title: `${exchange} ${name} Push`,
        body: `${exchange} ${name}의 현재 가격이 ${currentPrice} 입니다.`,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon"
      },
      priority: "high",
      // App 패키지 이름
      restricted_package_name: "com.client",
      // App에게 전달할 데이터
      data: {
        exchange,
        name,
      }
    }

    this.fcm.send(push_data, (err, response) => {
      if (err) {
        console.error('Push메시지 발송에 실패했습니다.');
        console.error(err);
        return;
      }
    
      console.log('Push메시지가 발송되었습니다.');
      console.log(response);
    })

    
    await push.destroy({
      success: obj => {
        console.log('push Deleted')
      },
      error: (obj, err) => {
        console.log(err);
      }
    })
  }

  async run(){
    this.requestCoinData();
    await this.updateAllPush();
    await this.checkAllPush();
    setTimeout(() => this.run(), 5000);
  }
}

module.exports = PushManager;