var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var Geocode = lib.Geocode;

describe("Geocode", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#request", function(){
    it("should make a geocode request", function(done){
      geoData = {
        addressLine1: "1 Street Name",
        city: "City",
        stateCode: "State",
        zip: "ZipCode"
      }
      helper.nock().post("/accounts/FakeAccountId/geocodeRequest", helper.buildXml({requestAddress: geoData})).reply(200, helper.xml.geocode, {"Content-Type": "application/xml"});
      Geocode.request(helper.createClient(), geoData, function(err, geocode){
        if(err){
          return done(err);
        }
        geocode.houseNumber.should.eql(1);
        geocode.streetName.should.eql("Street");
        geocode.streetSuffix.should.eql("Name");
        geocode.city.should.eql("City");
        geocode.stateCode.should.eql("State");
        geocode.zip.should.eql("ZipCode");
        geocode.plusFour.should.eql(1234);
        geocode.country.should.eql("US");
        done();
      });
    });

    it("should make a geocode with default client", function(done){
      geoData = {
        addressLine1: "1 Street Name",
        city: "City",
        stateCode: "State",
        zip: "ZipCode"
      }
      helper.nock().post("/accounts/FakeAccountId/geocodeRequest", helper.buildXml({requestAddress: geoData})).reply(200, helper.xml.geocode, {"Content-Type": "application/xml"});
      Geocode.request(geoData, function(err, geocode){
        if(err){
          return done(err);
        }
        geocode.houseNumber.should.eql(1);
        geocode.streetName.should.eql("Street");
        geocode.streetSuffix.should.eql("Name");
        geocode.city.should.eql("City");
        geocode.stateCode.should.eql("State");
        geocode.zip.should.eql("ZipCode");
        geocode.plusFour.should.eql(1234);
        geocode.country.should.eql("US");
        done();
      });
    });

    it("should handle 409 collision without error", function(done){
      geoData = {
        addressLine1: "123 Street Name",
        city: "City",
        stateCode: "State",
        zip: "ZipCode"
      }
      helper.nock().post("/accounts/FakeAccountId/geocodeRequest", helper.buildXml({requestAddress: geoData})).reply(409, helper.xml.geocode, {"Content-Type": "application/xml"});
      Geocode.request(helper.createClient(), geoData, function(err, geocode){
        if(err){
          return done(err);
        }
        geocode.houseNumber.should.eql(1);
        geocode.streetName.should.eql("Street");
        geocode.streetSuffix.should.eql("Name");
        geocode.city.should.eql("City");
        geocode.stateCode.should.eql("State");
        geocode.zip.should.eql("ZipCode");
        geocode.plusFour.should.eql(1234);
        geocode.country.should.eql("US");
        done();
      });
    });

    it("should report errors", function(done){
      geoData = {
        addressLine1: "Bad adrress line 1",
        city: "City",
        stateCode: "State",
        zip: "ZipCode"
      }
      helper.nock().post("/accounts/FakeAccountId/geocodeRequest", helper.buildXml({requestAddress: geoData})).reply(400, {"Content-Type": "application/xml"});
      Geocode.request(helper.createClient(), geoData, function(err, geocode){
        if(err){
          return done();
        }
        done(new Error('An error is estimated'));
      });
    });
  });
});
