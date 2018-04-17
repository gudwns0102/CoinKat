var axios = require('axios');

class Ticker {
  constructor(){
    this.data = {
      bithumb: null,
      coinone: null,
    }
  }

  getAPIAddress(exchangeName){
    switch(exchangeName){
        case "Bithumb":
            return "https://api.bithumb.com/public/ticker/all"
        
        case "Coinone":
            return "https://api.coinone.co.kr/ticker/?currency=all"
    }
  }

  update(exchange){
    var addr = this.getAPIAddress(exchange);
    axios.get(addr)
    .then(result => console.log(result))
  }

  updateAll(){
    Object.keys(this.data).map((exchange, index) => {
      this.update(exchange);
    })
  }
}

module.exports = Ticker;