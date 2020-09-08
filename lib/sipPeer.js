var Client = require("./client");
var Site = require("./site");

var SITE_PATH = "sites";
var SIP_PEER_PATH = "sippeers";
var TNS_PATH = "tns";
var MOVE_TNS_PATH = "movetns";

function SipPeer(){
};

SipPeer.create = function(client, item, callback){
 if(arguments.length === 2){
    callback = item;
    item = client;
    client = new Client();
 }
 var site = new Site();
 site.client = client;
 site.id = item.siteId;
 site.createSipPeer(item, callback);
};

SipPeer.get = function(client, siteId, id, callback){
  if(arguments.length === 3){
    callback = id;
    id = siteId;
    siteId = client;
    client = new Client();
  }
  var site = new Site();
  site.client = client;
  site.id = siteId;
  site.getSipPeer(id, callback);
};

SipPeer.list = function(client, siteId, callback){
  if(arguments.length === 2){
    callback = siteId;
    siteId = client;
    client = new Client();
  }
  var site = new Site();
  site.client = client;
  site.id = siteId;
  site.getSipPeers(callback);
};

SipPeer.prototype.delete = function(callback){
  this.client.makeRequest("delete", this.client.concatAccountPath(SITE_PATH) + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id, callback);
};

SipPeer.prototype.getTns = function(number, callback){
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + TNS_PATH);
  var field = null;
  var query = null;
  var singleNumber = typeof number === "string" || typeof number === "number" || number instanceof String;
  if(arguments.length === 1){
    query = {
      page: 1,
      size: 5000
    };
    callback = number;
    field = "sipPeerTelephoneNumbers";
  } else if (singleNumber){
    url += "/" + number;
  } else {
    query = number; 
    field = "sipPeerTelephoneNumbers";
    query.page = query.page || 1;
    query.size = query.size || 5000;
  }
  this.client.makeRequest("get", url, query, function(err, res){
    if(err){
      return callback(err);
    }
    var result = (field?res[field]:res).sipPeerTelephoneNumber;
    if (result && !Array.isArray(result) && !singleNumber) {
      result = [result];
    }
    callback(null, result);
  });
};

SipPeer.prototype.updateTns = function(number, data, callback){
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + TNS_PATH + "/" + number);
  this.client.makeRequest("put", url, {sipPeerTelephoneNumber: data}, callback);
};

SipPeer.prototype.moveTns = function(numbers, callback){
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + MOVE_TNS_PATH);
  this.client.makeRequest("post", url, {sipPeerTelephoneNumbers: {fullNumber: numbers}}, callback);
};

SipPeer.prototype.listApplication = function(callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "applicationSettings");
  this.client.makeRequest("get", url, function (err, results) {
    if (err) {
      callback(err);
    }
    else {
      var apps = results.applicationSettings;
      if (!Array.isArray(apps.httpMessagingV2AppId) && apps.httpMessagingV2AppId) {
        apps.httpMessagingV2AppId = [apps.httpMessagingV2AppId]
      }
      callback(null, apps)
    }
  })
}

SipPeer.prototype.editApplication = function(appData, callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "applicationSettings");
  const data = {applicationsSettings: appData}
  this.client.makeRequest("put", url, data, function (err, results) {
    if (err) {callback(err);}
    else {
      var apps = results.applicationSettings;
      callback(null, apps)
    }
  });
}

SipPeer.prototype.removeApplication = function(callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "applicationSettings");
  const data = {applicationsSettings: 'REMOVE'}
  this.client.makeRequest("put", url, data, callback);
}

SipPeer.prototype.getSmsSettings = function(callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "sms");
  this.client.makeRequest("get", url, function (err, results) {
    if (err) {callback(err);}
    else {
      var settings = results.sipPeerSmsFeature;
      if (settings.smppHosts && !Array.isArray(settings.smppHosts.smppHost)){
        settings.smppHosts.smppHost = [settings.smppHosts.smppHost]
      }
      callback(null, settings);
    }
  });
}

SipPeer.prototype.deleteSmsSettings = function(callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "sms");
  this.client.makeRequest("delete", url, callback);
}

SipPeer.prototype.createSmsSettings = function(settings, callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "sms");
  settings = {sipPeerSmsFeature: settings}
  this.client.makeRequest("post", url, settings, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(err, res.sipPeerSmsFeature)
  });
}

SipPeer.prototype.editSmsSettings = function(settings, callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "sms");
  settings = {sipPeerSmsFeature: settings}
  this.client.makeRequest("put", url, settings, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(err, res.sipPeerSmsFeature)
  });
}

SipPeer.prototype.getMmsSettings = function(callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "mms");
  this.client.makeRequest("get", url, function (err, results) {
    if (err) {callback(err);}
    else {
      var settings = results.mmsFeature;
      callback(null, settings);
    }
  });
}

SipPeer.prototype.deleteMmsSettings = function(callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "mms");
  this.client.makeRequest("delete", url, callback);
}

SipPeer.prototype.createMmsSettings = function(settings, callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "mms");
  settings = {mmsFeature: settings}
  this.client.makeRequest("post", url, settings, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(err, res.mmsFeature)
  });
}

SipPeer.prototype.editMmsSettings = function(settings, callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "messaging" + "/" + "features" + "/" + "mms");
  settings = {mmsFeature: settings}
  this.client.makeRequest("put", url, settings, function (err, res) {
    if (err) {
      return callback(err);
    }
    callback(err, res.mmsFeature)
  });
}

SipPeer.prototype.createOriginationSettings = function(settings, callback) {
  var url = this.client.concatAccountPath(SITE_PATH + "/" + this.siteId + "/" + SIP_PEER_PATH + "/" + this.id + "/" + "products" + "/" + "origination" + "/" + "settings");
  settings = {sipPeerOriginationSettings: settings};
  this.client.makeRequest("post", url, settings, function (err, res) {
    if (err) {   
      return callback(err);
    }
    callback(err, res.sipPeerOriginationSettings);
  });
}

module.exports = SipPeer;
