var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Aeuis = lib.Aeuis;


describe("Aeuis", function(){
    before(function(){
      nock.disableNetConnect();
      helper.setupGlobalOptions();
    });
    after(function(){
      nock.cleanAll();
      nock.enableNetConnect();
    });
    describe("#list", function(){
      it("should list of Aeuis's", function(done){
         
        var span = helper.nock()
          .get("/accounts/FakeAccountId/aeuis")
          .query({query: "param"})
          .reply(200, "", {"Content-Type": "application/xml"});
  
        Aeuis.list(helper.createClient(), {"query": "param"}, function(err, res){
          if(err){
            return done(err);
          }       
  
          try{
              span.isDone().should.be.true;
          } catch (err) {
              done(err);
              return;
          }
  
          done();
        });
      });
    });
    describe("#get", function(){
      it("should get an Aeuis", function(done){
         
        var id = "123";
          var span = helper.nock()
              .get(`/accounts/FakeAccountId/aeuis/${id}`)
              .reply(200, "", {"Content-Type": "application/xml"});
  
          Aeuis.get(helper.createClient(), id , function(err, res){
              if(err){
                  return done(err);
              }
              
              try{
                  span.isDone().should.be.true;
              } catch (err) {
                  done(err);
                  return;
              }
          done();
        });
      });
    });
});