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
});
