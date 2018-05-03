var axios = require('axios');
var PubSub = require('pubsub-js');
var { setTimeout } = require('timers');
class TickerManager {
  constructor(){
    this.data = {
      bithumb: {},
      coinone: {},
      upbit: {},
    }

    PubSub.subscribe('requestCoinData', () => {
      PubSub.publish('responseCoinData', this.data);
    })

    this.updateAll()

    setInterval(() => {
      this.updateAll();
    }, 3000);

    setTimeout(() => PubSub.publish('coinDataReady'), 3000);
  }

  getAPIAddress(exchangeName){
    switch(exchangeName){
        case "bithumb":
            return "https://api.bithumb.com/public/ticker/all"
        
        case "coinone":
            return "https://api.coinone.co.kr/ticker/?currency=all"
        
        case "upbit": 
            return "https://crix-api.upbit.com/v1/crix/trends/change_rate"
    }
  }

  purifyResponse(exchange, response){
    switch(exchange){
      case "bithumb":{
        var data = response.data.data;
        delete data.date;
        return data;
      }

      case "coinone":{
        var data = response.data;
        delete data.errorCode;
        delete data.result;
        delete data.timestamp;
        return data;
      }

      case "upbit":{
        var purifiedData = {};
        
        response.data.filter(item => {
          return item.code.search('KRW') != -1
        }).map(item => {
          var name = item.code.split('-')[1];
          var result = {};
          purifiedData[name] = {
            currentPrice: item.tradePrice,
            openPrice: item.openingPrice
          }
        })

        return purifiedData;
      }
    }
  }

  retrieveField(exchange){
    switch(exchange){
      case "bithumb": 
        return function(coinData){
          var result = {}
          var map = {
            currentPrice: 'buy_price',
            openPrice: 'opening_price',
          };

          Object.keys(map).map(newField => {
            result[newField] = coinData[map[newField]];
          })

          return result;
        };
      
      case "coinone":
        return function(coinData){
          var result = {}
          var map = {
            currentPrice: 'last',
            openPrice: 'first',
          }
          
          Object.keys(map).map(newField => {
            result[newField] = coinData[map[newField]];
          })

          return result;
        };
      
      case "upbit":
        return function(coinData){
          return coinData;
        }
    }
  }

   update(exchange){
    var addr = this.getAPIAddress(exchange);
    var retrieveField = this.retrieveField(exchange);
    axios.get(addr)
    .then((response) => {
      var data = this.purifyResponse(exchange, response);
      Object.keys(data).map(coin => {
        var COIN = coin.toUpperCase();
        this.data[exchange][COIN] = retrieveField(data[coin]);
      })
    })
  }

  updateAll(){
    Object.keys(this.data).map((exchange, index) => {
      this.update(exchange);
    })
  }
}

module.exports = TickerManager;