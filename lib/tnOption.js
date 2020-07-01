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
  client.makeRequest("get", client.concatAccountPath(TN_OPTION_PATH) + "/" + orderId, function(err, order){
    if(err){
      return callback(err);
    }
    if (order.tnOptionGroups && order.tnOptionGroups.tnOptionGroup) {
      order.tnOptionGroups = order.tnOptionGroups.tnOptionGroup;
      if (!Array.isArray(order.tnOptionGroups)) {
        order.tnOptionGroups = [order.tnOptionGroups];
      }
    }
    order.tnOptionGroups.forEach((item) => {
      if (item.telephoneNumbers && item.telephoneNumbers.telephoneNumber) {
        item.telephoneNumbers = item.telephoneNumbers.telephoneNumber
        if (!Array.isArray(item.telephoneNumbers)) {
          item.telephoneNumbers = [item.telephoneNumbers];
        }
      }
    });
    callback(null, order);
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
  client.makeRequest("post", client.concatAccountPath(TN_OPTION_PATH), {tnOptionOrder: order}, function(err, item){
   if(err){
     return callback(err);
   }
   if (item.tnOptionGroups && item.tnOptionGroups.tnOptionGroup) {
     item.tnOptionGroups = item.tnOptionGroups.tnOptionGroup;
     if (!Array.isArray(item.tnOptionGroups)) {
       item.tnOptionGroups = [item.tnOptionGroups];
     }
   }
   item.tnOptionGroups.forEach((tnOptionGroup) => {
     if (tnOptionGroup.telephoneNumbers && tnOptionGroup.telephoneNumbers.telephoneNumber) {
       tnOptionGroup.telephoneNumbers = tnOptionGroup.telephoneNumbers.telephoneNumber
       if (!Array.isArray(tnOptionGroup.telephoneNumbers)) {
         tnOptionGroup.telephoneNumbers = [tnOptionGroup.telephoneNumbers];
       }
     }
   });
   return callback(err, item);
 });
}
module.exports = TnOption;
