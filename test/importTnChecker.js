var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var ImportTnChecker = lib.ImportTnChecker;

describe("ImportTnChecker", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#check", function(){
    it("should check numbers", function(done){
      var numbers = ["1111", "2222"];
      var data = {importTnCheckerPayload: {telephoneNumbers:{telephoneNumber: numbers}}};
      var span = helper.nock().post("/accounts/FakeAccountId/importTnChecker", helper.buildXml(data)).reply(200, helper.xml.importTnCheck, {"Content-Type": "application/xml"});
      ImportTnChecker.check(helper.createClient(), numbers,  function(err, result){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        var erroredNumber = result.importTnCheckerPayload.importTnErrors.importTnError.telephoneNumbers.telephoneNumber;
        erroredNumber.toString().should.equal("2222");
        return done();
      });
    });
    it("should check numbers (with default client)", function(done){
      var numbers = ["1111", "2222"];
      var data = {importTnCheckerPayload: {telephoneNumbers:{telephoneNumber: numbers}}};
      var span = helper.nock().post("/accounts/FakeAccountId/importTnChecker", helper.buildXml(data)).reply(200, helper.xml.importTnCheck, {"Content-Type": "application/xml"});
      ImportTnChecker.check(numbers,  function(err, result){
        if(err){
          return done(err);
        }
        span.isDone().should.be.true;
        var erroredNumber = result.importTnCheckerPayload.importTnErrors.importTnError.telephoneNumbers.telephoneNumber;
        erroredNumber.toString().should.equal("2222");
        return done();
      });
    });
  });
});
