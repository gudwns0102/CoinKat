var http = require('http');
var https = require('https');
var redirectHttps = require('redirect-https');var app = require('express')();
var fs = require('fs');
var cors = require('cors')

var ParseServer = require('parse-server').ParseServer;
var api = new ParseServer({
  databaseURI: 'mongodb://localhost/CoinKat',
  cloud: './cloud/main.js',
  appId: 'QWDUKSHKDWOP@coinkat$HOFNDSESL#L',
  fileKey: 'myFileKey',
  masterKey: 'AOWHDDKNKLLR$@303k',
});

const lex = require('greenlock-express').create({
  version: 'v02', // draft-11 버전 인증서 사
  configDir: '/etc/letsencrypt', // 또는 ~/letsencrypt/etc
  server: 'production',
  approveDomains: (opts, certs, cb) => {
    if (certs) {
      opts.domains = ['coinkat.tk'];
    } else {
      opts.email = 'sejong3408@gmail.com';
      opts.agreeTos = true;
    }
    cb(null, { options: opts, certs });
  },
  renewWithin: 81 * 24 * 60 * 60 * 1000,
  renewBy: 80 * 24 * 60 * 60 * 1000,
});

var PushManager = require('./PushManager');
var pushManager = new PushManager();

var TickerManager = require('./TickerManager');
var tickerManager = new TickerManager();

app.use('/parse', api);
app.use(cors());

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

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

http.createServer(lex.middleware(redirectHttps())).listen(1337);
https.createServer(lex.httpsOptions, lex.middleware(app)).listen(443, () => console.log('start 3000 HTTPS'));