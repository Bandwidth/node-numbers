var Client = require("./client");
var APPLICATION_PATH = "applications";

function Application(){

}

Application.get = function(client, id, callback) {
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(APPLICATION_PATH), null, id, function(err, res){
    if(err){
      console.log(err)
      return callback(err);
    }
    var item = res.application;
    item.client = client;
    item.__proto__ = Application.prototype;
    callback(null, item);
  });
}

module.exports = Application;
