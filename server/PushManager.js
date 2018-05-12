var Parse = require('parse/node');
var PubSub = require('pubsub-js');
var { setTimeout } = require('timers');

class PushManager{
  constructor(){
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
    //Retrieve push data
    var parent = push.get('parent');
    var exchange = push.get('exchange');
    var name = push.get('name');
    var upPrice = push.get('upPrice');
    var downPrice = push.get('downPrice');
    var registeredAt = push.createdAt;

    //Query onesignal object and push player id 
    var query = new Parse.Query(Parse.Object.extend("OneSignal"));
    query.equalTo("parent", parent);
    var onesignal = await query.first();
    var web_id = onesignal.get("web_id");
    var mobile_id = onesignal.get("mobile_id");
    var include_player_ids = [web_id, mobile_id];

    //Created push history object
    var History = Parse.Object.extend("History");
    var history = new History({
      parent,
      exchange,
      name,
      upPrice,
      downPrice,
      registeredAt,
    })

    var { currentPrice } = this.coinData[exchange][name];

    var data = {
      app_id: "ae409015-636e-43be-ba61-77aa589cec89",
      contents: {"en": `${name} current price is ${currentPrice}!`},
      include_player_ids,
    }

    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic MmI2MDMwMDMtNTA3Ny00YmM1LTljNGItYzQ2ZmExOTJjZTA5"
    };

    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    
    var https = require('https');
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
        
        push.destroy();
        history.save();
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  }

  async run(){
    this.requestCoinData();
    await this.updateAllPush();
    await this.checkAllPush();
    setTimeout(() => this.run(), 5000);
  }
}

module.exports = PushManager;