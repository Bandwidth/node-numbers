var fs = require("fs");
var Client = require("./client");
var IMPORT_TN_ORDER_PATH = "importtnorders";
var LOAS_PATH = "loas";
var st = require("stream");
var streamifier = require("streamifier");

function ImportTnOrder(){
}

ImportTnOrder.create = function(client, data, numbers, callback){
  if(arguments.length === 3){
    callback = numbers;
    numbers = data;
    data = client;
    client = new Client();
  };
  data.telephoneNumbers = [numbers.map(number => {return {telephoneNumber: number}})];
  client.makeRequest("post", client.concatAccountPath(IMPORT_TN_ORDER_PATH), {importTnOrder: data}, function(err, item){
    if(err){
      return callback(err);
    }
    // ImportTnResponse Wraps importTn
    var response = item.importTnOrder;
    response.client = client;
    response.id = response.orderId;
    response.__proto__ = ImportTnOrder.prototype;
    callback(null, response);
   });
};

ImportTnOrder.get = function(client, id, callback){
  if(arguments.length === 2){
    callback = id;
    id = client;
    client = new Client();
  };
  client.makeRequest("get", client.concatAccountPath(IMPORT_TN_ORDER_PATH) + "/" + id, function(err, item){
    if(err){
      return callback(err);
    }
    item.client = client;
    item.id = id;
    item.__proto__ = ImportTnOrder.prototype;
    callback(null, item);
  });
};

ImportTnOrder.list = function(client, query, callback){
  if(arguments.length === 2){
    callback = query;
    query = client;
    client = new Client();
  }
  client.makeRequest("get", client.concatAccountPath(IMPORT_TN_ORDER_PATH), query, function(err, res){
    if(err){
      return callback(err);
    }
    return callback(null, res);
  });
};

ImportTnOrder.prototype.getHistory = function (callback) {
  this.client.makeRequest("get", this.client.concatAccountPath(IMPORT_TN_ORDER_PATH) + "/" + this.id + "/history", function (err, history) {
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
  else if(typeof file.pipe === "function" && typeof file.read === "function" && typeof file.on === "function"){
    stream = file;
  }
  if(stream){
    request.on("response", callback);
    request.on("error", function(err, result){
      return err;
    });
    stream.pipe(request);

    return;
  }
  throw new Error("Invalid data to send");
}

ImportTnOrder.prototype.createFile = function(file, mediaType, callback){
  if(arguments.length === 2){
    callback = mediaType;
    mediaType = null;
  }
  var client = this.client;
  var request = client.createPostRequest(client.concatAccountPath(IMPORT_TN_ORDER_PATH + "/" + this.id + "/" + LOAS_PATH));
  sendFile(request, file, mediaType, function(res){
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
};

ImportTnOrder.prototype.updateFile = function(fileName, file, mediaType, callback){
  if(arguments.length === 3){
    callback = mediaType;
    mediaType = null;
  }
  var request = this.client.createPutRequest(this.client.concatAccountPath(IMPORT_TN_ORDER_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName));
  var client = this.client;
  sendFile(request, file, mediaType, function(res){
    client.checkResponse(res, callback);
  });
};

ImportTnOrder.prototype.getFileMetadata = function(fileName, callback){
  this.client.makeRequest("get", this.client.concatAccountPath(IMPORT_TN_ORDER_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName + "/metadata"), callback);
};

ImportTnOrder.prototype.updateFileMetadata = function (fileName, metadata, callback) {
  this.client.makeRequest("put", this.client.concatAccountPath(IMPORT_TN_ORDER_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName + "/metadata"),
    { fileMetaData: metadata }, callback);
};

ImportTnOrder.prototype.getFiles = function(metadata, callback){
  if(arguments.length === 1){
    callback = metadata;
    metadata = false;
  }
  this.client.makeRequest("get", this.client.concatAccountPath(IMPORT_TN_ORDER_PATH + "/" + this.id + "/" + LOAS_PATH), {metadata: metadata}, function(err, result){
    if(err){
      return callback(err);
    }
    callback(null, result.fileData);
  });
};

ImportTnOrder.prototype.getFile = function(fileName, destination){
  var request = this.client.createGetRequest(this.client.concatAccountPath(IMPORT_TN_ORDER_PATH + "/" + this.id + "/" + LOAS_PATH + "/" + fileName));
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
module.exports = ImportTnOrder;
