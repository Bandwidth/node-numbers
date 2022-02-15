var lib = require("../");

lib.Client.globalOptions.apiEndPoint = "https://dashboard.bandwidth.com/api";
lib.Client.globalOptions.accountId = process.env.BW_ACCOUNT_ID;
lib.Client.globalOptions.userName = process.env.BW_USERNAME;
lib.Client.globalOptions.password = process.env.BW_PASSWORD;

describe("coveredRateCenter", function(){
    describe("#list", function(){
      it("should return list of coveredRateCenters", function(done){
        lib.CoveredRateCenter.list({zip: 27606, page: 1, size: 500}, function(err, list){
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
  