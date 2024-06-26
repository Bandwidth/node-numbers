var Client = require("./client");
var SITE_PATH = "sites";
var SIP_PEER_PATH = "sippeers";

function Site(){

}

Site.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(SITE_PATH), null, id, function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.site;
    item.client = client;
    item.__proto__ = Site.prototype;
    callback(null, item);
  });
};

Site.list = function(client, callback){
  if(arguments.length === 1){
    callback = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(SITE_PATH), function(err, res){
    if(err){
      return callback(err);
    }
    var items = res.sites.site || [];
    if(!Array.isArray(items)){
      items = [items];
    }
    var result = items.map(function(item){
      var i = item;
      i.client = client;
      i.__proto__ = Site.prototype;
      return i;
    });
    callback(null, result);
  });
};

Site.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  }
  var request = client.createPostRequest(client.concatAccountPath(SITE_PATH), {site: item});
  request.buffer().then(res =>{
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        Site.get(client, id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  }).catch(err => {
    return callback(err);
  });
};

Site.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(SITE_PATH) + "/" + this.id, {site: data}, callback);
};

Site.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(SITE_PATH) + "/" + this.id, callback);
};

Site.prototype.getSipPeers = function(callback){
  var client = this.client;
  var siteId = this.id;
  var SipPeer = require("./sipPeer");
  client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/" + SIP_PEER_PATH,  function(err, res){
    if(err){
      return callback(err);
    }
    if (!res.sipPeers) {
      return callback(null, [])
    }
    var items = res.sipPeers.sipPeer;
    if(!Array.isArray(items)){
      items = [items];
    }
    callback(null, items.map(function(item){
      item.client = client;
      item.__proto__ = SipPeer.prototype;
      item.id = item.peerId;
      item.siteId = siteId;
      return item;
    }));
  });
};

Site.prototype.getSipPeer = function(id, callback){
  var client = this.client;
  var siteId = this.id;
  var SipPeer = require("./sipPeer");
  client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/" + SIP_PEER_PATH + "/" + id,  function(err, res){
    if(err){
      return callback(err);
    }
    var item = res.sipPeer;
    item.client = client;
    item.__proto__ = SipPeer.prototype;
    item.id = item.peerId;
    item.siteId = siteId;
    callback(null, item);
  });
};

Site.prototype.createSipPeer = function(item, callback){
  var client = this.client;
  var self = this;
  var request = client.createPostRequest( this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/" + SIP_PEER_PATH, {sipPeer: item});
  request.buffer().then(res =>{
    if(res.ok && res.headers.location){
      Client.getIdFromLocationHeader(res.headers.location, function(err, id){
        if(err){
          return callback(err);
        }
        self.getSipPeer(id, callback);
      });
    }
    else{
      client.checkResponse(res, callback);
    }
  }).catch(err => {
    return callback(err);
  });
};

Site.prototype.getInserviceNumbers = function(query, callback){
  if(arguments.length === 1){
    callback = query;
    query = {};
  }
  this.client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/inserviceNumbers", query, function(err,res){
    if(err){
      return callback(err);
    }
    //TODO: Needs additional work when documentation is complete
    callback(null,res);
  });
};

Site.prototype.getOrders = function(query, callback){
  if(arguments.length === 1){
    callback = query;
    query = {};
  }
  this.client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/orders", query, function(err,res){
    if(err){
      return callback(err);
    }
    callback(null,res);
  });
};

Site.prototype.getPortIns = function(query, callback){
  if(arguments.length === 1){
    callback = query;
    query = {};
  }
  this.client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/portins", query, function(err,res){
    if(err){
      return callback(err);
    }
    //TODO: Needs additional documentation before can be completed
    callback(null,res);
  });
};

Site.prototype.getTotalTns = function(query, callback){
  if(arguments.length === 1){
    callback = query;
    query = {};
  }
  this.client.makeRequest("get", this.client.concatAccountPath(SITE_PATH) + "/" + this.id + "/totaltns", query, function(err,res){
    if(err){
      return callback(err);
    }
    //TODO: Needs additional documentation before can be completed
    callback(null,res);
  });
}

module.exports = Site;
