var Client = require("./client");
var GEOCODE_PATH = "geocodeRequest";
module.exports = {
  request: function(client, data, callback) {
    if(arguments.length === 2){
      callback = data;
      data = client;
      client = new Client();
    }
    var url = client.concatAccountPath(GEOCODE_PATH);
    client.makeRequest("post", url, {requestAddress: data}, function(err,res){
      if(err&&err.status !== 409){
        return callback(err);
      }
      if (err) { //409 means they found a geocode.
        return client.parseXml(err.response.res.text, function(err, results) {
          if (err) {
            return callback(err);
          }
          return callback(null, results.geocodeRequestResponse.geocodedAddress);
        })
      }
      return callback(null, res.geocodedAddress);
    })
  }
}
