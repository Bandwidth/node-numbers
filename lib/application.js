var Client = require("./client");
var APPLICATION_PATH = "sites";

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
      return callback(err);
    }
    return console.log(res);
    var item = res.site;
    item.client = client;
    item.__proto__ = Site.prototype;
    callback(null, item);
  });
}

module.exports = Application;
