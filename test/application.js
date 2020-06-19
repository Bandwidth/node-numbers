var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Application = lib.Application;

describe("Application", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of applications", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/applications").reply(200, helper.xml.applications, {"Content-Type": "application/xml"});
      Application.list(helper.createClient(), function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].applicationId.should.equal(1);
        list[0].appName.should.equal("Test Application");
        list[0].serviceType.should.equal("Messaging-V2");
        list[0].msgCallbackUrl.should.equal("http://a.com");
        done();
      });
    });

    it("should return list of applications (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/applications").reply(200, helper.xml.applications, {"Content-Type": "application/xml"});
      Application.list(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].applicationId.should.equal(1);
        list[0].appName.should.equal("Test Application");
        list[0].serviceType.should.equal("Messaging-V2");
        list[0].msgCallbackUrl.should.equal("http://a.com");
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/applications").reply(400);
      Application.list(helper.createClient(), function(err, list){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });

  describe("#get", function(){
    it("should return an application", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/applications/1").reply(200, helper.xml.application, {"Content-Type": "application/xml"});
      Application.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.applicationId.should.equal(1);
        item.appName.should.equal("Test Application");
        item.serviceType.should.equal("Messaging-V2");
        item.msgCallbackUrl.should.equal("http://a.com");
        done();
      });
    });
    it("should return an application (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/applications/1").reply(200, helper.xml.application, {"Content-Type": "application/xml"});
      Application.get("1",  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.applicationId.should.equal(1);
        item.appName.should.equal("Test Application");
        item.serviceType.should.equal("Messaging-V2");
        item.msgCallbackUrl.should.equal("http://a.com");
        done();
      });
    });
    it("should fail for error status code", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/applications/1").reply(400);
      Application.get(helper.createClient(), "1",  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#create", function(){
    it("should create a messaging application", function(done){
      var data = {appName: "Test Application", serviceType: "Messaging-V2"};
      helper.nock().post("/accounts/FakeAccountId/applications", helper.buildXml({application: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/applications/1"});
      helper.nock().get("/accounts/FakeAccountId/applications/1").reply(200, helper.xml.application, {"Content-Type": "application/xml"});
      Application.createMessagingApplication(helper.createClient(), data,  function(err, item){
        if(err){
          return done(err);
        }
        item.applicationId.should.equal(1);
        item.appName.should.equal("Test Application");
        item.serviceType.should.equal("Messaging-V2");
        done();
      });
    });
    it("should create a messaging application (with default client)", function(done){
      var data = {appName: "Test Application", serviceType: "Messaging-V2"};
      helper.nock().post("/accounts/FakeAccountId/applications", helper.buildXml({application: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/applications/1"});
      helper.nock().get("/accounts/FakeAccountId/applications/1").reply(200, helper.xml.application, {"Content-Type": "application/xml"});
      Application.createMessagingApplication(data,  function(err, item){
        if(err){
          return done(err);
        }
        item.applicationId.should.equal(1);
        item.appName.should.equal("Test Application");
        item.serviceType.should.equal("Messaging-V2");
        done();
      });
    });
    it("should create a voice application", function(done){
      var sendData = {appName: "Test Application"};
      var receivedData = {appName: "Test Application", serviceType: "Voice-V2"}
      helper.nock().post("/accounts/FakeAccountId/applications", helper.buildXml({application: receivedData})).reply(201, "", {"Location": "/accounts/FakeAccountId/applications/1"});
      helper.nock().get("/accounts/FakeAccountId/applications/1").reply(200, helper.xml.voiceApplication, {"Content-Type": "application/xml"});
      Application.createVoiceApplication(helper.createClient(), sendData,  function(err, item){
        if(err){
          return done(err);
        }
        item.applicationId.should.equal(2);
        item.appName.should.equal("Test Application 2");
        item.serviceType.should.equal("Voice-V2");
        done();
      });
    });
    it("should create a voice application (with default client)", function(done){
      var sendData = {appName: "Test Application"};
      var receivedData = {appName: "Test Application", serviceType: "Voice-V2"}
      helper.nock().post("/accounts/FakeAccountId/applications", helper.buildXml({application: receivedData})).reply(201, "", {"Location": "/accounts/FakeAccountId/applications/1"});
      helper.nock().get("/accounts/FakeAccountId/applications/1").reply(200, helper.xml.voiceApplication, {"Content-Type": "application/xml"});
      Application.createVoiceApplication(sendData,  function(err, item){
        if(err){
          return done(err);
        }
        item.applicationId.should.equal(2);
        item.appName.should.equal("Test Application 2");
        item.serviceType.should.equal("Voice-V2");
        done();
      });
    });

    it("should fail on error status code", function(done){
      var data = {appName: "Test Application", msgCallbackUrl: "http://example.com"};
      helper.nock().post("/accounts/FakeAccountId/applications").reply(400, "");
      Application.createMessagingApplication(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#update", function(){
    it("should update an application", function(done){
      var data = {appName: "Test Application"};
      helper.nock().put("/accounts/FakeAccountId/applications/1", helper.buildXml({application: data})).reply(200);
      var app = new Application();
      app.applicationId = 1;
      app.client = helper.createClient();
      app.update(data, done);
    });
  });
  describe("#delete", function(){
    it("should delete an application", function(done){
      helper.nock().delete("/accounts/FakeAccountId/applications/1").reply(200);
      var app = new Application();
      app.applicationId = 1;
      app.client = helper.createClient();
      app.delete(done);
    });
  });
  describe("#getSipPeers", function(){
    it("should return list of sippeers associated with the application", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/applications/1/associatedsippeers").reply(200, helper.xml.applicationSipPeers, {"Content-Type": "application/xml"});
      var app = new Application();
      app.client = helper.createClient();
      app.applicationId = "1";
      app.getSipPeers(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].siteId.should.equal(1);
        list[0].siteName.should.equal("Site Name");
        list[0].peerName.should.equal("Peer Name");
        list[0].peerId.should.equal(2)
        done();
      });
    });
    it("should fail on error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/applications/1/associatedsippeers").reply(400);
      var app = new Application();
      app.client = helper.createClient();
      app.id = "1";
      app.getSipPeers(function(err, list){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });


});
