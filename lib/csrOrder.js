var Client = require("./client");
var CSR_ORDER_PATH = "csrs";

function CsrOrder() {
}

CsrOrder.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(CSR_ORDER_PATH), null, id, function(err,res){
    if(err){
      return callback(err);
    }
    var item = res;
    item.client = client;
    item.__proto__ = CsrOrder.prototype;
    callback(null, item);
  });
};

// Coming soon
// CsrOrder.list = function(client,query, callback){
//   if(arguments.length === 2){
//     callback = query;
//     query = client;
//     client = new Client();
//   }
//   client.makeRequest("get", client.concatAccountPath(CSR_ORDER_PATH), query, function(err,res){
//     if(err){
//       return callback(err);
//     }
//     callback(null, res);
//   });
// };

CsrOrder.create = function(client, data, callback){
  if(arguments.length === 2){
    callback = data;
    data = client;
    client = new Client();
  }
  client.makeRequest("post", client.concatAccountPath(CSR_ORDER_PATH), {Csr: data}, function(err, item){
    if(err){
      return callback(err, item);
    }
    item.client = client;
    item.__proto__ = CsrOrder.prototype;
    callback(null, item);
  });
};

CsrOrder.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(CSR_ORDER_PATH) + "/" + this.id, {Csr: data}, callback);
};

CsrOrder.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(CSR_ORDER_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

CsrOrder.prototype.addNote = function(note, callback){
  var self = this;
  var request = this.client.createPostRequest(this.client.concatAccountPath(CSR_ORDER_PATH + "/" + this.id + "/notes"), {note: note});
  request.buffer().then(res =>{
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        self.getNotes(function(err, notes){
          if(err){
            return callback(err);
          }
          callback(null, notes.filter(function(n){ return n.id == id;})[0]);
        });
      });
    }
    else{
     self.client.checkResponse(res, callback);
   }
 });
};

module.exports = CsrOrder;
