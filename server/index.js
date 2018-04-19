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

var FCM = require('fcm-node');
var fcm = new FCM('AAAAcmJLzBY:APA91bF2x1IhD0HipgY7MY3ovle_fkizJEXJvK8s2kEAP-JPBa31i2zViSAT3OOD3EN84r4MoHat_2llwXiI67y7VkR760oSoSyzcucptu6VRaLY_lJTTYAXQE3Rjp43H_5empiNyjWj');

var push_data = {
  to: 'f2Hz1j_afP0:APA91bHzgD9GReXajQdJuC8l87NbFmUxNIOXwxWpEwzwurHPYNj2fWoSDVj4bnNKxMrfcR5UQU048f7y9uC9eKExm1Z7OK6qeWxCGL8-DV7rXHjx1ZkNhpnHOgkJNQqgzP089LUqE4P9';
  notification: {
    title: "Hello Node",
    body: "Node로 발송하는 Push 메시지 입니다.",
    sound: "default",
    click_action: "FCM_PLUGIN_ACTIVITY",
    icon: "fcm_push_icon"
  },
  priority: "high",
  // App 패키지 이름
  restricted_package_name: "com.client",
  // App에게 전달할 데이터
  data: {
      num1: 2000,
      num2: 3000
  }
}

fcm.send(push_data, function(err, response) {
  if (err) {
      console.error('Push메시지 발송에 실패했습니다.');
      console.error(err);
      return;
  }

  console.log('Push메시지가 발송되었습니다.');
  console.log(response);
});

// Serve the Parse API at /parse URL prefix
app.use('/parse', api);

app.get('/all', (req, res) => {
  res.send(ticker.data);
})

var Ticker = require('./Ticker');
var ticker = new Ticker();

app.listen(1337, () => console.log('start 3000')); 