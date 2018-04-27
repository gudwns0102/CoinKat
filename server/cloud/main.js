var network = require('./network.js');
var fs = require('fs');


Parse.Cloud.define('news', (req, res) => {
  var article = req.params.article;
  var string = (article.title + " " + article.description).toLocaleLowerCase().replace(/[^\w\s]/g, '').replace(/[\s]+/g, ' ').replace(/\n/g, ' ').trim();
  
  var skeleton = {};
  for(i in dic){
    skeleton[i] = 0;
  }

  for (var i = 0; i < string.len; i++)
  {
    var features = trainSet[i].features;
    var cl = inputs[i].class;
    // 0,0 => 0
    myNetwork.activate(features);
    myNetwork.propagate(alpha, [cl]);
  }
})