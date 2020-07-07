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
        done(new Error("An error is expected"));
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
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#create", function(){
    it("should add a portout passcode", function(done){
      const userInput = {
        customerOrderId: 'myOrderId',
        tnOptionGroups: [
          {
            portOutPasscode: 'mypass1',
            telephoneNumbers: ['2018551020']
          }
        ]
      }
      const receivedData = {
        customerOrderId: 'myOrderId',
        tnOptionGroups: {
          tnOptionGroup: [
            {
              portOutPasscode: 'mypass1',
              telephoneNumbers: {
                telephoneNumber: ['2018551020']
              }
            }
          ]
        }
      }
      helper.nock().post("/accounts/FakeAccountId/tnoptions", helper.buildXml({tnOptionOrder: receivedData})).reply(201, helper.xml.tnOption, {"Location": "/accounts/FakeAccountId/tnoptions/1"});
      TnOption.create(helper.createClient(), userInput,  function(err, item){
        if(err){
          return done(err);
        }
        item.createdByUser.should.equal('user');
        item.tnOptionGroups[0].numberFormat.should.equal('10digit');
        item.tnOptionGroups[0].telephoneNumbers[0].should.equal('2018551020');
        done();
      });
    });

    it("should create a call forward number", function(done){
      const userInput = {
        customerOrderId: 'myOrderId',
        tnOptionGroups: [
          {
            callForward: '6042661720',
            telephoneNumbers: ['2018551020']
          }
        ]
      }
      const receivedData = {
        customerOrderId: 'myOrderId',
        tnOptionGroups: {
          tnOptionGroup: [
            {
              callForward: '6042661720',
              telephoneNumbers: {
                telephoneNumber: ['2018551020']
              }
            }
          ]
        }
      }
      helper.nock().post("/accounts/FakeAccountId/tnoptions", helper.buildXml({tnOptionOrder: receivedData})).reply(201, helper.xml.tnOption, {"Location": "/accounts/FakeAccountId/tnoptions/1"});
      TnOption.create(helper.createClient(), userInput,  function(err, item){
        if(err){
          return done(err);
        }
        item.createdByUser.should.equal('user');
        item.tnOptionGroups[0].callForward.should.equal('6042661720');
        item.tnOptionGroups[0].telephoneNumbers[0].should.equal('2018551020');
        done();
      });
    });

    it("should change sms", function(done){
      const userInput = {
        customerOrderId: 'myOrderId',
        tnOptionGroups: [
          {
            sms: 'on',
            callForward: '6042661720',
            telephoneNumbers: ['2018551020']
          }
        ]
      }
      const receivedData = {
        customerOrderId: 'myOrderId',
        tnOptionGroups: {
          tnOptionGroup: [
            {
              sms: 'on',
              callForward: '6042661720',
              telephoneNumbers: {
                telephoneNumber: ['2018551020']
              }
            }
          ]
        }
      }
      helper.nock().post("/accounts/FakeAccountId/tnoptions", helper.buildXml({tnOptionOrder: receivedData})).reply(201, helper.xml.tnOption, {"Location": "/accounts/FakeAccountId/tnoptions/1"});
      TnOption.create(helper.createClient(), userInput,  function(err, item){
        if(err){
          return done(err);
        }
        item.createdByUser.should.equal('user');
        item.tnOptionGroups[0].callForward.should.equal('6042661720');
        item.tnOptionGroups[0].telephoneNumbers[0].should.equal('2018551020');
        item.tnOptionGroups[0].sms.should.equal('on');
        done();
      });
    });

    it("should fail on error status code", function(done){
      const userInput = {
        customerOrderId: 'myOrderId',
        tnOptionGroups: [
          {
            sms: 'on',
            callForward: '6042661720',
            telephoneNumbers: ['2018551020']
          }
        ]
      }
      helper.nock().post("/accounts/FakeAccountId/tnoptions").reply(400, "");
      TnOption.create(helper.createClient(), userInput,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
});
