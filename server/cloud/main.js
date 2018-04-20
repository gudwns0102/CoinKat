Parse.Cloud.job('test', (req, res) => {
  var Push = Parse.Object.extend("Push");
  var query = new Parse.Query(Push);

  query.find({
    success: results => {
      console.log(results)
      res.success({code: 100});
    },
    error: (err) => {
      console.log(err)
      res.error();
    }
  })
})