var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var TnOption = lib.TnOption;

describe("TnOption", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of tnOption", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnoptions").reply(200, helper.xml.tnOptions, {"Content-Type": "application/xml"});
      TnOption.list(helper.createClient(), {}, function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].userId.should.equal('userId');
        list[0].accountId.should.equal('accountId');
        list[0].orderDate.should.equal("orderDate");
        list[0].orderStatus.should.equal("FAILED");
        done();
      });
    });
    it("should return list of sites (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnoptions").reply(200, helper.xml.tnOptions, {"Content-Type": "application/xml"});
      TnOption.list({}, function(err, list){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        list.length.should.equal(2);
        list[0].userId.should.equal('userId');
        list[0].accountId.should.equal('accountId');
        list[0].orderDate.should.equal("orderDate");
        list[0].orderStatus.should.equal("FAILED");
        done();
      });
    });

    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/tnOptions").reply(400);
      TnOption.list(helper.createClient(), {}, function(err, list){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#get", function(){
    it("should return a tnOption", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnoptions/12345").reply(200, helper.xml.tnOption, {"Content-Type": "application/xml"});
      TnOption.get(helper.createClient(), "12345",  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        console.log(item);
        item.createdByUser.should.equal('user');
        item.tnOptionGroups[0].numberFormat.should.equal('10digit');
        item.tnOptionGroups[0].callForward.should.equal('6042661720');
        item.tnOptionGroups[0].telephoneNumbers[0].should.equal('2018551020');
        done();
      });
    });
    it("should return a site (with default client)", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnoptions/12345").reply(200, helper.xml.tnOption, {"Content-Type": "application/xml"});
      TnOption.get("12345",  function(err, item){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        console.log(item);
        item.createdByUser.should.equal('user');
        item.tnOptionGroups[0].numberFormat.should.equal('10digit');
        item.tnOptionGroups[0].callForward.should.equal('6042661720');
        item.tnOptionGroups[0].telephoneNumbers[0].should.equal('2018551020');
        done();
      });
    });
    it("should fail for error status code", function(done){
      var span = helper.nock().get("/accounts/FakeAccountId/tnoptions/12345").reply(400);
      TnOption.get(helper.createClient(), "12345",  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#create", function(){
    it("should create a  site", function(done){
      var data = {name: "Test Site", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/sites", helper.buildXml({site: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/sites/1"});
      helper.nock().get("/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
      Site.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.name.should.equal("Test Site");
        item.description.should.equal("A Site Description");
        done();
      });
    });
    it("should create a  site (with default client)", function(done){
      var data = {name: "Test Site", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/sites", helper.buildXml({site: data})).reply(201, "", {"Location": "/accounts/FakeAccountId/sites/1"});
      helper.nock().get("/accounts/FakeAccountId/sites/1").reply(200, helper.xml.site, {"Content-Type": "application/xml"});
      Site.create(data,  function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal(1);
        item.name.should.equal("Test Site");
        item.description.should.equal("A Site Description");
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {name: "Test Site", description: "A Site Description"};
      helper.nock().post("/accounts/FakeAccountId/sites").reply(400, "");
      Site.create(helper.createClient(), data,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
});
