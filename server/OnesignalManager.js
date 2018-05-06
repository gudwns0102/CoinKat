class OnesignalManager {
  constructor(){

    var message = { 
      app_id: "ae409015-636e-43be-ba61-77aa589cec89",
      contents: {"en": "English Message"},
      included_segments: ["All"]
    };

    setTimeout(() => this.sendNotification(message), 5000);
  }

  sendNotification(data){
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
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  };
}