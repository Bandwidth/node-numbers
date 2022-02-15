var lib = require("../");
var coveredRateCenter = lib.CoveredRateCenter;
var client = lib.Client;
console.log(client);
client.globalOptions.accountId = process.env.BW_ACCOUNT_ID;
client.globalOptions.userName = process.env.BW_USERNAME;
client.globalOptions.password = process.env.BW_PASSWORD;


describe("coveredRateCenter", function(){
    describe("#list", function(){
      it("should return list of coveredRateCenters", function(done){
        coveredRateCenter.list(client, {zip:27606}, function(err, list){
          if(err){
            return done(err);
          }
          list.length.should.equal(1);
          list[0].name.should.equal("RALEIGH");
          list[0].abbreviation.should.equal("RALEIGH");
          done();
        });
      });
    });
  });
  