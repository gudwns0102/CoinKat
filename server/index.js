var app = require('express')();
var server = require('http').Server(app);

var ParseServer = require('parse-server').ParseServer;
var api = new ParseServer({
  databaseURI: 'mongodb://localhost/CoinKat',
  cloud: './cloud/main.js',
  appId: 'QWDUKSHKDWOP@coinkat$HOFNDSESL#L',
  fileKey: 'myFileKey',
  masterKey: 'AOWHDDKNKLLR$@303k',
});

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

app.get('/all', (req, res) => {

})

var Ticker = require('./Ticker');
var ticker = new Ticker();

ticker.updateAll();

app.listen(1337, () => console.log('start 3000'));