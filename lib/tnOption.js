var Client = require("./client");
var TN_OPTION_PATH = "tnoptions";

function TnOption(){
}

TnOption.get = function(client, orderId, callback){
  if(arguments.length === 2){
    callback = orderId;
    orderId = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(TN_OPTION_PATH) + "/" + orderId, function(err, item){
    if(err){
      return callback(err);
    }
    callback(null, item);
  });
};

TnOption.list = function(client, query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(TN_OPTION_PATH), query, function(err,res){
    if(err){
      return callback(err);
    }
    var items = res.tnOptionOrderSummary || res.tnOptionOrder || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    callback(null, items);
  });
}

TnOption.create = function(client, order, callback){
  if(arguments.length === 2){
    callback = order;
    order = client;
    client = new Client();
  }
  order.tnOptionGroups = {tnOptionGroup: order.tnOptionGroups}
  order.tnOptionGroups.tnOptionGroup.forEach((group) => {
    group.telephoneNumbers = {telephoneNumber: group.telephoneNumbers}
  });

  var request = client.createPostRequest(client.concatAccountPath(TN_OPTION_PATH), {tnOptionOrder: order});
  request.buffer().then(res =>{
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        TnOption.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  }).catch(err => {
    return callback(err);
  });
}
module.exports = TnOption;
