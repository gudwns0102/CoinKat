var axios = require('axios');

class Ticker {
  constructor(){
    this.data = {
      bithumb: {},
      coinone: {},
    }

    setInterval(() => {
      console.log('Fetch API')
      this.updateAll();
    }, 3000);
  }

  getAPIAddress(exchangeName){
    switch(exchangeName){
        case "bithumb":
            return "https://api.bithumb.com/public/ticker/all"
        
        case "coinone":
            return "https://api.coinone.co.kr/ticker/?currency=all"
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
    }
  }

  update(exchange){
    var addr = this.getAPIAddress(exchange);
    var retrieveField = this.retrieveField(exchange);
    axios.get(addr)
    .then(response => {
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

module.exports = Ticker;