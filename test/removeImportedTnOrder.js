var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var RemoveImportedTnOrder = lib.RemoveImportedTnOrder;

describe("RemoveImportedTnOrder", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#list", function(){
    it("should return list of orders", function(done){
      helper.nock().get("/accounts/FakeAccountId/removeImportedTnOrders").reply(200, helper.xml.removeImportedTnOrderList, {"Content-Type": "application/xml"});
      var client = helper.createClient();
      RemoveImportedTnOrder.list(client, {}, (err, items) => {
        if(err){
          return done(err);
        }
        items.totalCount.should.eql(2);
        items.removeImportedTnOrderSummary.length.should.eql(2);
        done();
      });
    });
    it("should return list of orders (with default client)", function(done){
      helper.nock().get("/accounts/FakeAccountId/removeImportedTnOrders").reply(200, helper.xml.removeImportedTnOrderList, {"Content-Type": "application/xml"});
      RemoveImportedTnOrder.list({}, (err, items) => {
        if(err){
          return done(err);
        }
        items.totalCount.should.eql(2);
        items.removeImportedTnOrderSummary.length.should.eql(2);
        done();
      });
    });
    describe("#getHistory", () => {
      it("should fetch history of a removeImportedTnOrder", (done) => {
        helper.nock().get("/accounts/FakeAccountId/removeImportedTnOrders/1/history").reply(200, helper.xml.removeImportedTnOrderHistory, {"Content-Type": "application/xml"});
        var order = new RemoveImportedTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        order.getHistory(function(err, history){
          if(err){
            return done(err);
          }
          history.length.should.eql(4);
          done();
        });
      });
    });
    describe("#disconnectNumbers", function(){
      it("should disconnect numbers", function(done){
        var numbers = ["9199918388", "4158714245", "4352154439", "4352154466"]
        var data = {
          removeImportedTnOrder:{
            customerOrderId: "test",
            _nameXmlElement: "CustomerOrderId",
            telephoneNumbers: [
              numbers.map(function(number) {
                return {telephoneNumber: number};
            })]
          }
        };
        helper.nock().post("/accounts/FakeAccountId/removeImportedTnOrders", helper.buildXml(data)).reply(200, helper.xml.removeImportedTnOrderResponse, {"Content-Type": "application/xml"});
        RemoveImportedTnOrder.create(helper.createClient(), "test", numbers, (err, item) => {
          if(err){
            return done(err);
          }
          item.id.should.eql("7527b3fc-3f72-4d0a-acae-ccc7e77857ed");
          done();
        });
      });
      it("should disconnect numbers (with default client)", function(done){
        var numbers = ["9199918388", "4158714245", "4352154439", "4352154466"]
        var data = {
          removeImportedTnOrder:{
            customerOrderId: "test",
            _nameXmlElement: "CustomerOrderId",
            telephoneNumbers: [
              numbers.map(function(number) {
                return {telephoneNumber: number};
            })]
          }
        };
        helper.nock().post("/accounts/FakeAccountId/removeImportedTnOrders", helper.buildXml(data)).reply(200, helper.xml.removeImportedTnOrderResponse, {"Content-Type": "application/xml"});
        RemoveImportedTnOrder.create(helper.createClient(), "test", numbers, (err, item) => {
          if(err){
            return done(err);
          }
          item.id.should.eql("7527b3fc-3f72-4d0a-acae-ccc7e77857ed");
          done();
        });
      });
    });
  });
});
