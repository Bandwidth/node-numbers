var Client = require("./client");
var COVERED_RATE_CENTER_PATH = "coveredRateCenters";

module.exports = {
  list: function(client, query, callback){
    console.log(arguments.length);
    let args = Array.from(arguments);
      args.forEach(arg => {
        console.log(arg);
      });
    if (arguments.length == 2) {
      let args = Array.from(arguments);
      args.forEach(arg => {
        if (arg instanceof Client) {
          client = arg;
        } else if (typeof arg == 'object') {
          if (!(client instanceof Client)) {
            client = null;
          }
          query = arg;
        } else if (typeof arg == 'function') {
          if (!(client instanceof Client)) {
            client = null;
          }
          callback = arg;
        }
      });
      if (client == null) {
        client = new Client();
      }
      if (query ==  null) {
        query = {
          "page": 1,
          "size": 500
        }
      }
      if (callback == null) {
        console.log("Please provide a callback function.")
        process.exit(1);
      }
    }
    query.page = query.page || 1;
    query.size = query.size || 500;
    console.log(query, callback, client);
    client.makeRequest("get", COVERED_RATE_CENTER_PATH, query, function(err, res){
      if(err){
        return callback(err);
      }
      var items = res.coveredRateCenter || [];
      if(!Array.isArray(items)){
        items = [items];
      }
      callback(null, items);
    });
  }
};

