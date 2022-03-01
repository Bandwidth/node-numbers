var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Account = lib.Account;

describe("Account", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#get", function(){
    it("should return account", function(done){
      helper.nock().get("/accounts/FakeAccountId").reply(200, helper.xml.account, {"Content-Type": "application/xml"});
      Account.get(helper.createClient(), function(err, account){
        if(err){
          return done(err);
        }
        account.accountId.should.eql(14);
        done();
      });
    });
  });
  describe("#getProducts", function(){
    it("should get account product info", function(done){
      helper.nock().get("/accounts/FakeAccountId/products").reply(200, helper.xml.accountProducts, {"Content-Type": "application/xml"});
      Account.getProducts(helper.createClient(), function(err, accountProducts){
        if(err) {
          return done(err);
        }
        accountProducts.product[0].name.should.eql("Termination");
        accountProducts.product[1].name.should.eql("VirtualInventory");
        done();
      });
    });
  });
  describe("#getMoveTnsOrders", function(){
    it("Should list all moveTns orders on an account", function(done){
      helper.nock().get("/accounts/FakeAccountId/moveTns").reply(200, helper.xml.getMoveTnsOrders, {"Content-Type": "application/xml"});
      Account.getMoveTnsOrders(helper.createClient(), function(err, getMoveTnsOrders){
        if(err) {
          return done(err);
        }
        getMoveTnsOrders.totalCount.should.eql(2);
        getMoveTnsOrders.moveTnsOrderSummary[0].userId.should.eql("systemUser");
        done();
      });
    });
  });
  describe("#moveTns", function(){
    it("Should move Tns from one sippeer to another", function(done){
      numbers = ["1111", "2222"]
      data = {
        CustomerOrderId: "abc123",
        SiteId: "12345",
        SipPeerId: "54321"
      }
      data.telephoneNumbers = [numbers.map(number => {return {telephoneNumber: number}})];
      helper.nock().post("/accounts/FakeAccountId/moveTns").reply(200, helper.xml.moveTns, {"Content-Type": "application/xml"});
      Account.moveTns(helper.createClient(), data, function(err, moveTns){
        if(err) {
          return done(err);
        }
        moveTns.moveTnsOrder.accountId.should.eql(9999999);
        moveTns.moveTnsOrder.orderId.should.eql('093a9f9b-1a78-4e47-b6e2-776a484596f4');
        done();
      });
    });
  });
  describe("#getMoveTnsOrder", function(){
    it("Should retrieve information for a single moveTns order", function(done){
      helper.nock().get("/accounts/FakeAccountId/moveTns/Fake-order-Id-12345-98765").reply(200, helper.xml.getMoveTnsOrder, {"Content-Type": "application/xml"});
      Account.getMoveTnsOrder(helper.createClient(), "Fake-order-Id-12345-98765", function(err, getMoveTnsOrder){
        if(err) {
          return done(err);
        }
        getMoveTnsOrder.accountId.should.eql(9900012);
        getMoveTnsOrder.telephoneNumbers.telephoneNumber[0].should.eql('2106078250');
        done();
      });
    });
  });
  describe("#getMoveTnsOrderHistory", function(){
    it("Should retrieve history for a single moveTns order", function(done){
      helper.nock().get("/accounts/FakeAccountId/moveTns/Fake-order-Id-12345-98765/history").reply(200, helper.xml.getMoveTnsOrderHistory, {"Content-Type": "application/xml"});
      Account.getMoveTnsOrderHistory(helper.createClient(), "Fake-order-Id-12345-98765", function(err, getMoveTnsOrderHistory){
        if(err) {
          return done(err);
        }
        getMoveTnsOrderHistory.orderHistory[0].author.should.eql('admin');
        getMoveTnsOrderHistory.orderHistory[1].author.should.eql('admin');
        done();
      });
    });
  });
});
