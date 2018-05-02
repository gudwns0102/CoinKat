var app = require('express')();
var http = require('http');
var https = require('https');
var fs = require('fs');
var cors = require('cors')

var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}

var ParseServer = require('parse-server').ParseServer;
var api = new ParseServer({
  databaseURI: 'mongodb://localhost/CoinKat',
  cloud: './cloud/main.js',
  appId: 'QWDUKSHKDWOP@coinkat$HOFNDSESL#L',
  fileKey: 'myFileKey',
  masterKey: 'AOWHDDKNKLLR$@303k',
});

var Parse = require('parse/node');

var PushManager = require('./PushManager');
var pushManager = new PushManager();


app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use('/parse', api);
app.use(cors());

app.get('/all', (req, res) => {
  console.log(tickerManager.data);
  res.send(tickerManager.data);
})

app.get('/reverseAll', (req, res) => {
  const data = tickerManager.data;
  var result = {};
  Object.keys(data).map(exchange => {
    Object.keys(data[exchange]).map(coin => {
      coin in result ? result[coin].push(exchange) : result[coin] = [exchange];
    })
  })

  res.send(result);
})

var TickerManager = require('./TickerManager');
var tickerManager = new TickerManager();

http.createServer(app).listen(1337, () => console.log('start 1337 HTTP')); 
https.createServer(options, app).listen(3000, () => console.log('start 3000 HTTPS'));