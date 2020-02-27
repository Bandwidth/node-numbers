var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var CsrOrder = lib.CsrOrder;

describe("Csr", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  // Coming Soon
  // describe("#list", function(){
  //   it("should return a list of Csrs ", function(done){
  //     helper.nock().get("/accounts/FakeAccountId/csrs").reply(200, helper.xml.csrOrders, {"Content-Type":"application/xml"});
  //     CsrOrder.list(helper.createClient(), {}, function(err,list){
  //       if(err){
  //         return done(err);
  //       }
  //       list.should.be.ok;
  //       done();
  //     });
  //   });
  // });
  describe("#get", function(){
    it("should get Csr successfully", function(done){
      helper.nock().get("/accounts/FakeAccountId/csrs/1").reply(200, helper.xml.csrOrder, {"Content-Type": "application/xml"});
      CsrOrder.get(helper.createClient(), "1", function(err, csrOrder){
        if(err){
          return done(err);
        }
        csrOrder.should.be.ok;
        csrOrder.csrData.serviceAddress.unparsedAddress.should.eql("1234 Main ST Durham NC 27707");
        csrOrder.csrData.workingTelephoneNumber.should.eql("9198675309");
        done();
      });
    });
  });
  describe("#create", function(){
    it("should create Csr successfully", function(done){
      var data = {
        customerOrderId: "MyId5",
        WorkingOrBillingTelephoneNumber:"9198675309",
        accountNumber:"123463",
        endUserPIN:"1231"
      };
      helper.nock().post("/accounts/FakeAccountId/csrs", helper.buildXml({Csr: data})).reply(201, helper.xml.csrResponse, {"Location": "/accounts/FakeAccountId/csrs/1"});
      CsrOrder.create(helper.createClient(), data, function(err, csrOrder){
        if(err){
          return done(err);
        }
        csrOrder.should.be.ok;
        csrOrder.orderId.should.eql("218a295f-4f8a-4d1a-ba55-3e0aac6207cb");
        done();
      });
    });
  });
  describe("#update", function(){
    it("should update successfully", function(done){
      var data = {endUserPIN:"1234"};
      helper.nock().put("/accounts/FakeAccountId/csrs/1", helper.buildXml({Csr: data})).reply(200);
      var order = new CsrOrder();
      order.id = "1";
      order.client = helper.createClient();
      order.endUserPIN = "1234";
      order.update(data,done);
    })
  });
  describe("#getNotes", function(){
    it("should return notes", function(done){
      helper.nock().get("/accounts/FakeAccountId/csrs/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new CsrOrder();
      order.id = 1;
      order.client = helper.createClient();
      order.getNotes(function(err, notes){
        if(err){
          return done(err);
        }
        notes.length.should.equal(2);
        notes[0].id.should.equal(11299);
        notes[0].userId.should.equal("customer");
        notes[0].description.should.equal("Test");
        done();
      });
    });
    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/orders/1/notes").reply(400);
      var order = new CsrOrder();
      order.id = 1;
      order.client = helper.createClient();
      order.getNotes(function(err, notes){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
  });
  describe("#addNote", function(){
    it("should add new note", function(done){
      var data = {userId: "customer", description: "Test"};
      helper.nock().post("/accounts/FakeAccountId/csrs/1/notes", helper.buildXml({note: data})).reply(200, "", {"Location": "/accounts/FakeAccountId/csrs/1/notes/11299"});
      helper.nock().get("/accounts/FakeAccountId/csrs/1/notes").reply(200, helper.xml.notes, {"Content-Type": "application/xml"});
      var order = new CsrOrder();
      order.id = 1;
      order.client = helper.createClient();
      order.addNote(data, function(err, note){
        if(err){
          return done(err);
        }
        note.id.should.equal(11299);
        note.userId.should.equal("customer");
        note.description.should.equal("Test");
        done();
      });
    });
  });
});
