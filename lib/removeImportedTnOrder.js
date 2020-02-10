var fs = require("fs");
var Client = require("./client");
var REMOVE_IMPORTED_TN_ORDERS_PATH = "removeImportedTnOrders";

function Disconnect(){
}

Disconnect.create = function (client, customerOrderId, numbers, callback){
  if(arguments.length === 3){
    callback = numbers;
    numbers = customerOrderId;
    customerOrderId = client;
    client = new Client();
  }
  var data = {
    removeImportedTnOrder:{
      customerOrderId: customerOrderId,
      _nameXmlElement: "CustomerOrderId",
      telephoneNumberList:
        numbers.map(function(number) {
          return {telephoneNumber: number};
        })
    }
  };
  client.makeRequest("post", client.concatAccountPath(REMOVE_IMPORTED_TN_ORDERS_PATH), data, callback);
};

Disconnect.list = function (client, query, callback) {
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(REMOVE_IMPORTED_TN_ORDERS_PATH), query, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(null, res);
  });
};

Disconnect.get = function(client, id, query, callback){
  if(arguments.length === 3){
    callback = query;
    query = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(REMOVE_IMPORTED_TN_ORDERS_PATH + "/" + id), query, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null,res);
  });

}

Disconnect.prototype.getHistory = function (callback) {
  this.client.makeRequest("get", this.client.concatAccountPath(REMOVE_IMPORTED_TN_ORDERS_PATH) + "/" + this.id + "/history", function (err, history) {
    if (err) {
      return callback(err);
    }
    var items = history.orderHistory;
    callback(null, Array.isArray(items) ? items : [items]);
  });
};

module.exports = Disconnect;
