var fs = require("fs");
var Client = require("./client");
var PORT_IN_PATH = "portins";
var LOAS_PATH = "loas";
var st = require("stream");
var streamifier = require("streamifier");

function PortIn(){
}

PortIn.create = function(client, item, callback){
  if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
  };
 client.makeRequest("post", client.concatAccountPath(PORT_IN_PATH), {lnpOrder: item}, function(err, item){
  if(err){
    return callback(err);
  }
  item.client = client;
  item.id = item.orderId;
  item.__proto__ = PortIn.prototype;
  callback(null, item);
 });
};

PortIn.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  };
  client.makeRequest("get", client.concatAccountPath(PORT_IN_PATH) + "/" + id, function(err, item){
    if(err){
      return callback(err);
    }
    item.client = client;
    item.id = id;
    item.__proto__ = PortIn.prototype;
    callback(null, item);
  });
};

PortIn.list = function(client, query, callback){
  if(arguments.length ===2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(PORT_IN_PATH), query, function(err, res){
    if(err){
      return callback(err);
    }
    return callback(null, res);
  });
};


PortIn.prototype.update = function(data, callback){
  this.client.makeRequest("put", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id, {lnpOrderSupp: data}, callback);
};

PortIn.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id, callback);
};

PortIn.prototype.getAreaCodes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/areaCodes", function(err,areaCodes){
    if(err){
      return callback(err);
    }
    var items = areaCodes.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.getNpaNxx = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/npaNxx", function(err,npaNxx){
    if(err){
      return callback(err);
    }
    var items = npaNxx.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.getTotals = function(callback) {
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/totals", function(err,totals){
    if(err){
      return callback(err);
    }
    var items = totals.telephoneDetailsReport;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.getTns = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/tns", function(err,tns){
    if(err){
      return callback(err);
    }
    callback(null, tns);
  });
}

PortIn.prototype.getActivationStatus = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/activationStatus", function(err,status){
    if(err){
      return callback(err);
    }
    callback(null, status)
  });
}

PortIn.prototype.setActivationStatus = function(data, callback){
  callback("this method is not implemented");
}


PortIn.prototype.getNotes = function(callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/notes", function(err, notes){
    if(err){
      return callback(err);
    }
    var items = notes.note;
    callback(null, Array.isArray(items)?items:[items]);
  });
};

PortIn.prototype.addNote = function(note, callback){
  var self = this;
  this.client.sendRequest(() => this.client.createPostRequest(this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/notes"), {note: note}), function(err, res){
    if(err){
      return callback(err);
    }
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

PortIn.prototype.getHistory = function (callback) {
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH) + "/" + this.id + "/history", function (err, history) {
    if (err) {
      return callback(err);
    }
    var items = history.orderHistory;
    callback(null, Array.isArray(items) ? items : [items]);
  });
};

function sendFile(request, file, mediaType, callback){
  var stream = null;
  request.buffer().type(mediaType || "application/octet-stream");
  if(typeof file === "string"){
    stream = fs.createReadStream(file);
  }
  else if(Buffer.isBuffer(file)){
    stream = streamifier.createReadStream(file);
  }
  else if(file && typeof file.pipe === "function" && typeof file.read === "function" && typeof file.on === "function"){
    stream = file;
  }
  if(!stream){
    return callback(new Error("Invalid data to send"));
  }
  var done = false;
  // a 4xx/5xx emits "response" then "error"; only report the first
  var finish = function(err, res){
    if(!done){
      done = true;
      callback(err, res);
    }
  };
  request.on("response", function(res){
    finish(null, res);
  });
  request.on("error", finish);
  stream.on("error", finish);
  stream.pipe(request);
}

PortIn.prototype.createFile = function(file, mediaType, callback){
  if(arguments.length === 2){
    callback = mediaType;
    mediaType = null;
  }
  var client = this.client;
  client.buildAuthenticatedRequest(() => client.createPostRequest(client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH)), function(err, request){
    if(err){
      return callback(err);
    }
    sendFile(request, file, mediaType, function(err, res){
      if(err){
        return callback(err);
      }
      client.checkResponse(res, function(err, result){
        if(err){
          return callback(err);
        }
        if (typeof result !== 'undefined') {
          return callback(null, result.filename);
        }
        else {
          return callback(null, "");
        }
      });
    });
  });
};

PortIn.prototype.updateFile = function(fileName, file, mediaType, callback){
  if(arguments.length === 3){
    callback = mediaType;
    mediaType = null;
  }
  var client = this.client;
  client.buildAuthenticatedRequest(() => client.createPutRequest(client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName)), function(err, request){
    if(err){
      return callback(err);
    }
    sendFile(request, file, mediaType, function(err, res){
      if(err){
        return callback(err);
      }
      client.checkResponse(res, callback);
    });
  });
};

PortIn.prototype.getFileMetadata = function(fileName, callback){
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName + "/metadata"), callback);
};

PortIn.prototype.updateFileMetadata = function (fileName, metadata, callback) {
  this.client.makeRequest("put", this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName + "/metadata"),
    { fileMetaData: metadata }, callback);
};

PortIn.prototype.getFiles = function(metadata, callback){
  if(arguments.length === 1){
    callback = metadata;
    metadata = false;
  }
  this.client.makeRequest("get", this.client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH), {metadata: metadata}, function(err, result){
    if(err){
      return callback(err);
    }
    callback(null, result.fileData);
  });
};

PortIn.prototype.getFile = function(fileName, destination, callback){
  if(typeof destination === "function"){
    callback = destination;
    destination = null;
  }
  var client = this.client;
  var buildRequest = () => client.createGetRequest(client.concatAccountPath(PORT_IN_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName));
  if(!callback){
    return pipeToDestination(buildRequest(), destination);
  }
  client.buildAuthenticatedRequest(buildRequest, function(err, request){
    if(err){
      return callback(err);
    }
    callback(null, pipeToDestination(request, destination));
  });
}

function pipeToDestination(request, destination){
  if(destination){
    var stream = null;
    if(typeof destination === "string"){
      stream = fs.createWriteStream(destination);
    }
    else if(typeof destination.write === "function"){
      stream = destination;
    }
    if(stream){
      return request.pipe(stream);
    }
  }
  return request;
}
module.exports = PortIn;
