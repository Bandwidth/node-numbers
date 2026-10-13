var Client = require("../").Client;
var nock = require("nock");
var xml = require("./xml");
module.exports = {
  setupGlobalOptions: function(){
    Client.globalOptions.accountId = "FakeAccountId";
    Client.globalOptions.userName = "FakeUserName";
    Client.globalOptions.password = "FakePassword";
  },

  createClient: function(){
    return new Client("FakeAccountId", "FakeUserName", "FakePassword");
  },

  createOAuthClient: function(){
    return new Client("FakeAccountId", null, null, "FakeClientId", "FakeClientSecret");
  },

  nockToken: function(){
    return nock("https://api.bandwidth.com").post("/api/v1/oauth2/token", "grant_type=client_credentials");
  },

  buildXml: function(obj){
    return this.createClient().buildXml(obj);
  },

  nock: function(){
    return nock("https://dashboard.bandwidth.com/api");
  },

  xml: xml
};
