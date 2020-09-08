var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var SipPeer = lib.SipPeer;

describe("SipPeer", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of peers", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers").reply(200, helper.xml.sipPeers, {"Content-Type": "application/xml"});
      SipPeer.list(helper.createClient(), 1, function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].id.should.equal(12345);
        list[0].peerName.should.equal("SIP Peer 1");
        list[0].description.should.equal("Sip Peer 1 description");
        done();
      });
    });
    it("should return list of peers with default client", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers").reply(200, helper.xml.sipPeers, {"Content-Type": "application/xml"});
      SipPeer.list(1, function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(1);
        list[0].id.should.equal(12345);
        list[0].peerName.should.equal("SIP Peer 1");
        list[0].description.should.equal("Sip Peer 1 description");
        done();
      });
    });
  });
  describe("#get", function(){
    it("should return a peer", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.get(helper.createClient(), 1, 10, function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
    it("should return a peer with default client", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.get(1, 10, function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
  });
  describe("#create", function(){
    it("should create a sip peer", function(done){
      var data = {peerName: "SIP Peer 1", description: "Sip Peer 1 description", siteId: 1};
      helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers", helper.buildXml({sipPeer: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/sites/1/sippeers/10"});
      helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.create(helper.createClient(), data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
    it("should create a sip peer with default client", function(done){
      var data = {peerName: "SIP Peer 1", description: "Sip Peer 1 description", siteId: 1};
      helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers", helper.buildXml({sipPeer: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/sites/1/sippeers/10"});
      helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10").reply(200, helper.xml.sipPeer, {"Content-Type": "application/xml"});
      SipPeer.create(data, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(10);
        item.peerName.should.equal("SIP Peer 1");
        item.description.should.equal("Sip Peer 1 description");
        done();
      });
    });
  });
  describe("#delete", function(){
    it("should remove a peer", function(done){
      helper.nock().delete("/accounts/FakeAccountId/sites/1/sippeers/10").reply(200);
      var peer = new SipPeer();
      peer.client = helper.createClient();
      peer.siteId = 1;
      peer.id = 10;
      peer.delete(done);
    });
    it("should fail for error status code", function(done){
      helper.nock().delete("/accounts/FakeAccountId/sites/1/sippeers/10").reply(400);
      var peer = new SipPeer();
      peer.client = helper.createClient();
      peer.siteId = 1;
      peer.id = 10;
      peer.delete(function(err){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#getTns", function(){
    it("should return list of numbers", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/tns?page=1&size=5000").reply(200, helper.xml.sipPeerTns, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getTns(function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(17);
        list[0].fullNumber.should.equal("3034162216");
        done();
      });
    });
    it("should return list of numbers with a query", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/tns?page=1&size=100").reply(200, helper.xml.sipPeerTns, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getTns({page:1, size:100}, function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(17);
        list[0].fullNumber.should.equal("3034162216");
        done();
      });
    });

    it("should return a number", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/tns/12345").reply(200, helper.xml.sipPeerTn, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getTns("12345", function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        item.fullNumber.should.equal("9195551212");
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/tns/12345").reply(400);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getTns("12345", function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#updateTns", function(){
    it("should update a number", function(done){
      var data = {fullNumber: "123456", rewriteUser: "test"};
      var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/tns/12345", helper.buildXml({sipPeerTelephoneNumber: data})).reply(200);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.updateTns("12345", data, done);
    });
  });
  describe("#moveTns", function(){
    it("should move numbers", function(done){
      var data = ["111", "222"];
      var span = helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers/10/movetns", helper.buildXml({sipPeerTelephoneNumbers: {fullNumber: data}})).reply(200);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.moveTns(data, done);
    });
  });
  describe("#listApplication", function() {
    it("should list application", function(done) {
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/applicationSettings").reply(200, helper.xml.peerApplications, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.listApplication(function(err, results) {
        if (err) {
          done(err);
        } else {
          results.httpMessagingV2AppId[0].should.equal(100)
          done();
        }
      });
    });
  });
  describe("#editApplication", function() {
    it("should edit the application", function(done) {
      var appData = {httpMessagingV2AppId: 100}
      var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/applicationSettings", helper.buildXml({applicationsSettings: appData})).reply(200, helper.xml.peerApplications, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      var appData = {httpMessagingV2AppId: 100}
      peer.editApplication(appData, function(err, results) {
        if (err) {
          done(err);
        } else {
          results.httpMessagingV2AppId.should.equal(100)
          done();
        }
      });
    });

    it("should fail on an error", function(done) {
      var appData = {httpMessagingV2AppId: 100}
      var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/applicationSettings", helper.buildXml({applicationsSettings: appData})).reply(400);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      var appData = {httpMessagingV2AppId: 100}
      peer.editApplication(appData, function(err, results) {
        if (err) {
          done();
        } else {
          done(new Error('An error is expected'));
        }
      });
    });
  });
  describe("#removeApplication", function() {
    it("should remove application", function(done) {
      var appData = 'REMOVE';
      var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/applicationSettings", helper.buildXml({applicationsSettings: appData})).reply(200, helper.xml.peerApplications, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.removeApplication(done);
    });
    it("should fail on an error", function(done) {
      var appData = 'REMOVE';
      var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/applicationSettings", helper.buildXml({applicationsSettings: appData})).reply(400);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.removeApplication(function(err) {
        if (err) {
          done();
        } else {
          done(new Error('An error is expected'));
        }
      });
    });
  });

  describe("#getSmsSettings", function() {
    it("should get SMS settings", function(done) {
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms").reply(200, helper.xml.peerSmsSettings, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getSmsSettings(function(err, results) {
        if (err) {
          done(err);
        } else {
          results.sipPeerSmsFeatureSettings.tollFree.should.equal(true);
          results.sipPeerSmsFeatureSettings.protocol.should.equal('SMPP');
          results.smppHosts.smppHost.length.should.equal(1);
          results.smppHosts.smppHost[0].hostId.should.equal(18);
          done();
        }
      });
    });

    it("should fail on error status code", function(done) {
      var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms").reply(400, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.getSmsSettings(function(err, results) {
        if (err) {
          done();
        } else {
          done(new Error('An error is expected'));
        }
      });
    });
  });
  describe("#deleteSmsSettings", function() {
    it("should delete SMS settings", function(done) {
      var span = helper.nock().delete("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms").reply(200);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.deleteSmsSettings(done);
    });

    it("should fail on error status code", function(done) {
      var span = helper.nock().delete("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms").reply(400);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.deleteSmsSettings(function (err) {
        if (err) {
          done();
        } else {
          done(new Error('An error is expected'));
        }
      });
    });
  });
  describe("#editSmsSettings", function() {
    it("should create SMS settings", function(done) {
      var settingsData = {
        sipPeerSmsFeatureSettings: {
          tollFree: true,
          shortCode: true,
          A2pLongCode: 'DefaultOff',
          zone1:true,
          zone2:true,
          zone3:true,
          zone4:true,
          zone5:true,
        },
        smppHosts: {
          smppHost: [
            {
              priority:0,
              connectionType: 'RECEIVER_ONLY',
              hostId: 18
            }
          ]
        }
      }
      var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms", helper.buildXml({sipPeerSmsFeature: settingsData})).reply(200, helper.xml.peerSmsSettings, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.editSmsSettings(settingsData, function(err, results) {
        if (err) {
          done(err);
        } else {
          results.sipPeerSmsFeatureSettings.zone5.should.equal(true);
          done();
        }
      });
    });

    it("should fail for error status code", function(done) {
      var settingsData = {
        sipPeerSmsFeatureSettings: {
          tollFree: true,
          shortCode: true,
          A2pLongCode: 'DefaultOff',
          zone1:true,
          zone2:true,
          zone3:true,
          zone4:true,
          zone5:true,
        },
        smppHosts: {
          smppHost: [
            {
              priority:0,
              connectionType: 'RECEIVER_ONLY',
              hostId: 18
            }
          ]
        }
      }
      var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms", helper.buildXml({sipPeerSmsFeature: settingsData})).reply(400);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.editSmsSettings(settingsData, function(err, results) {
        if (err) {
          done();
        } else {
          done(new Error('An error is expected'));
        }
      });
    });
  });
  describe("#createSmsSettings", function() {
    it("should create SMS settings", function(done) {
      var settingsData = {
        sipPeerSmsFeatureSettings: {
          tollFree: true,
          shortCode: true,
          A2pLongCode: 'DefaultOff',
          zone1:true,
          zone2:true,
          zone3:true,
          zone4:true,
          zone5:true,
        },
        smppHosts: {
          smppHost: [
            {
              priority:0,
              connectionType: 'RECEIVER_ONLY',
              hostId: 18
            }
          ]
        }
      }
      var span = helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms", helper.buildXml({sipPeerSmsFeature: settingsData})).reply(200, helper.xml.peerSmsSettings, {"Content-Type": "application/xml"});
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.createSmsSettings(settingsData, function(err, results) {
        if (err) {
          done(err);
        } else {
          results.sipPeerSmsFeatureSettings.zone5.should.equal(true);
          done();
        }
      });
    });

    it("should fail for error status code", function(done) {
      var settingsData = {
        sipPeerSmsFeatureSettings: {
          tollFree: true,
          shortCode: true,
          A2pLongCode: 'DefaultOff',
          zone1:true,
          zone2:true,
          zone3:true,
          zone4:true,
          zone5:true,
        },
        smppHosts: {
          smppHost: [
            {
              priority:0,
              connectionType: 'RECEIVER_ONLY',
              hostId: 18
            }
          ]
        }
      }
      var span = helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/sms", helper.buildXml({sipPeerSmsFeature: settingsData})).reply(400);
      var peer = new SipPeer();
      peer.id = 10;
      peer.siteId = 1;
      peer.client = helper.createClient();
      peer.createSmsSettings(settingsData, function(err, results) {
        if (err) {
          done();
        } else {
          done(new Error('An error is expected'));
        }
      });
    });
  });
});

describe("#getMmsSettings", function() {
  it("should get MMS settings", function(done) {
    var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms").reply(200, helper.xml.peerMmsSettings, {"Content-Type": "application/xml"});
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.getMmsSettings(function(err, results) {
      if (err) {
        done(err);
      } else {
        results.mmsSettings.protocol.should.equal('HTTP');
        results.protocols.hTTP.httpSettings.proxyPeerId.should.equal(500017);
        done();
      }
    });
  });

  it("should fail on error status code", function(done) {
    var span = helper.nock().get("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms").reply(400, {"Content-Type": "application/xml"});
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.getSmsSettings(function(err, results) {
      if (err) {
        done();
      } else {
        done(new Error('An error is expected'));
      }
    });
  });
});
describe("#deleteMmsSettings", function() {
  it("should delete MMS settings", function(done) {
    var span = helper.nock().delete("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms").reply(200);
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.deleteMmsSettings(done);
  });

  it("should fail on error status code", function(done) {
    var span = helper.nock().delete("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms").reply(400);
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.deleteMmsSettings(function (err) {
      if (err) {
        done();
      } else {
        done(new Error('An error is expected'));
      }
    });
  });
});
describe("#editMmsSettings", function() {
  it("should create MMS settings", function(done) {
    var settingsData = {
      mmsSettings: {
        protocol: 'HTTP'
      },
      protocols: {
        HTTP: {
          httpSettings: {
            proxyPeerId: 500017
          }
        }
      }
    }
    var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms", helper.buildXml({mmsFeature: settingsData})).reply(200, helper.xml.peerMmsSettings, {"Content-Type": "application/xml"});
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.editMmsSettings(settingsData, function(err, results) {
      if (err) {
        done(err);
      } else {
        results.protocols.hTTP.httpSettings.proxyPeerId.should.equal(500017);
        done();
      }
    });
  });

  it("should fail for error status code", function(done) {
    var settingsData = {
      mmsSettings: {
        protocol: 'HTTP'
      },
      protocols: {
        HTTP: {
          httpSettings: {
            proxyPeerId: 500017
          }
        }
      }
    }
    var span = helper.nock().put("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms", helper.buildXml({mmsFeature: settingsData})).reply(400);
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.editMmsSettings(settingsData, function(err, results) {
      if (err) {
        done();
      } else {
        done(new Error('An error is expected'));
      }
    });
  });
});
describe("#createMmsSettings", function() {
  it("should create MMS settings", function(done) {
    var settingsData = {
      mmsSettings: {
        protocol: 'HTTP'
      },
      protocols: {
        HTTP: {
          httpSettings: {
            proxyPeerId: 500017
          }
        }
      }
    }
    var span = helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms", helper.buildXml({mmsFeature: settingsData})).reply(200, helper.xml.peerMmsSettings, {"Content-Type": "application/xml"});
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.createMmsSettings(settingsData, function(err, results) {
      if (err) {
        done(err);
      } else {
        results.protocols.hTTP.httpSettings.proxyPeerId.should.equal(500017);
        done();
      }
    });
  });

  it("should fail for error status code", function(done) {
    var settingsData = {
      mmsSettings: {
        protocol: 'HTTP'
      },
      protocols: {
        HTTP: {
          httpSettings: {
            proxyPeerId: 500017
          }
        }
      }
    }
    var span = helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers/10/products/messaging/features/mms", helper.buildXml({mmsFeature: settingsData})).reply(400);
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.createMmsSettings(settingsData, function(err, results) {
      if (err) {
        done();
      } else {
        done(new Error('An error is expected'));
      }
    });
  });
});
describe("#OriginationSettings", function() {
  it("should create origination settings", function(done) {
    var settingsData = {
      voiceProtocol: "HTTP"
    }
    var span = helper.nock().post("/accounts/FakeAccountId/sites/1/sippeers/10/products/origination/settings", helper.buildXml({sipPeerOriginationSettings: settingsData})).reply(200, helper.xml.originationSettings, {"Content-Type": "application/xml"});
    var peer = new SipPeer();
    peer.id = 10;
    peer.siteId = 1;
    peer.client = helper.createClient();
    peer.createOriginationSettings(settingsData, function(err, results) {
      if (err) {
        done(err);
      } else {
        results.voiceProtocol.should.equal("HTTP");
        done();
      }
    });
  });
});
