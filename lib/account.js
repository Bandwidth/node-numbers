var Client = require("./client");
var MOVE_TNS_PATH = "moveTns";

module.exports = {
  get: function(client, callback){
    if(arguments.length === 1){
      callback = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath(), function(err,res){
      if(err){
        return callback(err);
      }
      callback(null, res.account);
    });
  },

  getProducts: function(client, callback) {
    if(arguments.length === 1){
      callback = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath("products"), function(err,res) {
      if(err){
        return callback(err);
      }
      callback(null, res.products);
    });
  },

  getMoveTnsOrders: function(client, callback) {
    if(arguments.length === 1){
      callback = client;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath("moveTns"), function(err,res){
      if(err){
        return callback(err);
      }
      callback(null, res);
    });
  },

  moveTns: function(client, item, callback) {
    if(arguments.length === 2){
      item = client;
      callback = item;
      client = new Client();
    }
    client.makeRequest("post", client.concatAccountPath(MOVE_TNS_PATH), {moveTnsOrder: item}, function(err, res){
      if(err){
        return callback(err, res);
      }
      callback(null, res);
     });
  },

  getMoveTnsOrder: function(client, id, callback) {
    if(arguments.length === 2){
      id = client;
      callback = id;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath("moveTns") + "/" + id, function(err,res){
      if(err){
        return callback(err);
      }
      callback(null, res);
    });
  },

  getMoveTnsOrderHistory: function(client, id, callback) {
    if(arguments.length === 2){
      id = client;
      callback = id;
      client = new Client();
    }
    client.makeRequest("get", client.concatAccountPath("moveTns")+ "/" + id + "/history", function(err,res){
      if(err){
        return callback(err);
      }
      callback(null, res);
    });
  }
}
