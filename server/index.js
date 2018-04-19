var app = require('express')();
var server = require('http').Server(app);

var ParseServer = require('parse-server').ParseServer;
var api = new ParseServer({
  databaseURI: 'mongodb://localhost/CoinKat',
  cloud: './cloud/main.js',
  appId: 'QWDUKSHKDWOP@coinkat$HOFNDSESL#L',
  fileKey: 'myFileKey',
  masterKey: 'AOWHDDKNKLLR$@303k',
  push: {
    android: {
      senderId: '1519459543887',
      apiKey: '	AIzaSyBsEiJH9M_FUwHkdtW0ptd9DbDVw87bShY',
    },
    ios: {
      pfx: '/file/path/to/XXX.p12',
      passphrase: '', // optional password to your p12/PFX
      bundleId: '',
      production: false
    }
  }
});

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

app.get('/all', (req, res) => {
  res.send(ticker.data);
})

var Ticker = require('./Ticker');
var ticker = new Ticker();

app.listen(1337, () => console.log('start 3000')); 