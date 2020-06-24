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
      return callback(err);
    }
    var item = res.application;
    item.client = client;
    item.__proto__ = Application.prototype;
    callback(null, item);
  });
}

Application.list = function(client, callback){
  if(arguments.length === 1){
    callback = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(APPLICATION_PATH), function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.applicationList.application || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    var result = items.map(function(item){
      var i = item;
      i.client = client;
      i.__proto__ = Application.prototype;
      return i;
    });
    callback(null, result);
  });
};

Application._createApplication = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(APPLICATION_PATH), {application: item});
  request.buffer().then(res =>{
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        Application.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  }).catch(err => {
    return callback(err);
  });
};

Application.createVoiceApplication = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  item.ServiceType = 'Voice-V2';
  this._createApplication(client, item, callback);
};
Application.createMessagingApplication = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  item.ServiceType = 'Messaging-V2'
  this._createApplication(client, item, callback);
};
Application.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(APPLICATION_PATH) + "/" + this.applicationId, {application: data}, callback);
};

Application.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(APPLICATION_PATH) + "/" + this.applicationId, callback);
};

Application.prototype.getSipPeers = function(query, callback){
  if(arguments.length === 1){
    callback = query;
    query = {};
  }
  this.client.makeRequest("get", this.client.concatAccountPath(APPLICATION_PATH) + "/" + this.applicationId + "/associatedsippeers", function(err,res){
    if(err){
      return callback(err);
    }
    let sipPeers = res.associatedSipPeers.associatedSipPeer;
    if(!Array.isArray(sipPeers) && sipPeers){
      sipPeers = [sipPeers];
    }
    callback(null,sipPeers);
  });
};

module.exports = Application;
