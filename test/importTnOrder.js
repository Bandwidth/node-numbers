var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var os = require("os");
var path = require("path");
var fs = require("fs");
var ImportTnOrder = lib.ImportTnOrder;

describe("ImportTnOrders", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#create", function(){
    it("should create an order", function(done){
      var data = {
        customerOrderId: "1111",
        siteId: "222",
        sipPeerId: "333",
        loaAuthorizingPerson: "LoaAuthorizingPerson",
        subscriber: {
          name: "ABC Inc.",
          serviceAddress: {
            houseNumber: "11235",
            streetName: "StreetName",
            stateCode: "NC",
            city: "City",
            county: "county",
            zip: "27606"
          }
        }
      };
      var numbers = ["9198675309", "8288675309"];
      data.telephoneNumbers = [numbers.map(number => {return {telephoneNumber: number}})];
      helper.nock().post("/accounts/FakeAccountId/importtnorders", helper.buildXml({importTnOrder: data})).reply(200, helper.xml.importTnOrder);
      ImportTnOrder.create(helper.createClient(), data, numbers, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal("ba87c8ef-4cc5-435d-a346-cda601776257");
        done();
      });
    });
    it("should create an order (with default client)", function(done){
      var data = {
        customerOrderId: "1111",
        siteId: "222",
        sipPeerId: "333",
        loaAuthorizingPerson: "LoaAuthorizingPerson",
        subscriber: {
          name: "ABC Inc.",
          serviceAddress: {
            houseNumber: "11235",
            streetName: "StreetName",
            stateCode: "NC",
            city: "City",
            county: "county",
            zip: "27606"
          }
        }
      };
      var numbers = ["9198675309", "8288675309"];
      data.telephoneNumbers = [numbers.map(number => {return {telephoneNumber: number}})];
      helper.nock().post("/accounts/FakeAccountId/importtnorders", helper.buildXml({importTnOrder: data})).reply(200, helper.xml.importTnOrder);
      ImportTnOrder.create(helper.createClient(), data, numbers, function(err, item){
        if(err){
          return done(err);
        }
        item.id.should.equal("ba87c8ef-4cc5-435d-a346-cda601776257");
        done();
      });
    });
    it("should fail on error status code", function(done){
      var data = {
        customerOrderId: "1111",
        siteId: "222",
        sipPeerId: "333",
        loaAuthorizingPerson: "LoaAuthorizingPerson",
        subscriber: {
          name: "ABC Inc.",
          serviceAddress: {
            houseNumber: "11235",
            streetName: "StreetName",
            stateCode: "NC",
            city: "City",
            county: "county",
            zip: "27606"
          }
        }
      };
      var numbers = ["9198675309", "8288675309"];
      helper.nock().post("/accounts/FakeAccountId/importtnorders").reply(400, "");
      ImportTnOrder.create(helper.createClient(), data, numbers,  function(err, item){
        if(err){
          return done();
        }
        done(new Error("An error is expected"));
      });
    });
  });
  describe("#getImportTnOrder", function(){
    it("should return a importTnOrder", function(done){
      helper.nock().get("/accounts/FakeAccountId/importtnorders/021a94f5-5c55-401f-9cdc-8dca059ad7c1").reply(200, helper.xml.importTnOrderResponse, {"Content-Type": "application/xml"});
      ImportTnOrder.get("021a94f5-5c55-401f-9cdc-8dca059ad7c1", (err, item) => {
        if(err){
          return done(err);
        }
        item.id.should.eql("021a94f5-5c55-401f-9cdc-8dca059ad7c1");
        item.processingStatus.toLowerCase().should.eql("complete");
        done();
      })
    });
  });
  describe("#getImportTnOrders", function(){
    it("should return a list of ImportTnOrderSummary(s)", function(done){
      helper.nock().get("/accounts/FakeAccountId/importtnorders").reply(200, helper.xml.importTnOrderList, {"Content-Type": "application/xml"});
      ImportTnOrder.list({}, (err, items) => {
        if(err){
          return done(err);
        }
        items.totalCount.should.eql(2);
        items.importTnOrderSummary.length.should.eql(2);
        done();
      })
    });
  });
  describe("#getHistory", function(){
    it("should return histoy", function(done){
      helper.nock().get("/accounts/FakeAccountId/importtnorders/1/history").reply(200, helper.xml.importTnOrderHistory, {"Content-Type": "application/xml"});
      var order = new ImportTnOrder();
      order.id = 1;
      order.client = helper.createClient();
      order.getHistory(function(err, history){
        if(err){
          return done(err);
        }
        history.length.should.eql(2);
        done();
      });
    });
  });
  describe("#getFiles", function(){
    it("should return list of files", function(done){
      helper.nock().get("/accounts/FakeAccountId/importtnorders/1/loas?metadata=true").reply(200, helper.xml.files, {"Content-Type": "application/xml"});
      var order = new ImportTnOrder();
      order.id = 1;
      order.client = helper.createClient();
      order.getFiles(true, function(err, items){
        if(err){
          return done(err);
        }
        items.length.should.equal(6);
        items[0].fileName.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6-1416231534986.txt");
        items[0].fileMetaData.documentType.should.equal("LOA");
        done();
      });
    });
    it("should return list of files (without metadata)", function(done){
      helper.nock().get("/accounts/FakeAccountId/importtnorders/1/loas?metadata=false").reply(200, helper.xml.files, {"Content-Type": "application/xml"});
      var order = new ImportTnOrder();
      order.id = 1;
      order.client = helper.createClient();
      order.getFiles(function(err, items){
        if(err){
          return done(err);
        }
        items.length.should.equal(6);
        items[0].fileName.should.equal("d28b36f7-fa96-49eb-9556-a40fca49f7c6-1416231534986.txt");
        done();
      });
    });
    it("should fail for error status code", function(done){
      helper.nock().get("/accounts/FakeAccountId/importtnorders/1/loas?metadata=false").reply(400);
      var order = new ImportTnOrder();
      order.id = 1;
      order.client = helper.createClient();
      order.getFiles(function(err, items){
        if(err){
          return done();
        }
        done(new Error("An error is estimated"));
      });
    });
    describe("#getFileMetadata", function(){
      it("should return file's metadata", function(done){
        helper.nock().get("/accounts/FakeAccountId/importtnorders/1/loas/file.txt/metadata").reply(200, helper.xml.fileMetadata, {"Content-Type": "application/xml"});
        var order = new ImportTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        order.getFileMetadata("file.txt", function(err, meta){
          if(err){
            return done(err);
          }
          meta.documentType.should.equal("LOA");
          done();
        });
      });
    });
    describe("#updateFileMetadata", function(){
      it("should update file's metadata", function(done){
        var metadata = { documentName: "doc", documentType: "type"};
        helper.nock().put("/accounts/FakeAccountId/importtnorders/1/loas/file.txt/metadata", helper.buildXml({ fileMetaData: metadata})).reply(200);
        var order = new ImportTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        order.updateFileMetadata("file.txt", metadata, done);
      });
    });
    describe("#getFile", function(){
      var tmpFile = path.join(os.tmpdir(), "dest.txt");
      beforeEach(function(){
        helper.nock().get("/accounts/FakeAccountId/importtnorders/1/loas/file.txt").reply(200, "12345", {"Content-Type": "text/plain"});
      });
      afterEach(function(done){
        nock.cleanAll();
        fs.unlink(tmpFile, done);
      });
      it("should download file to destination file", function(done){
        var order = new ImportTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        var stream = order.getFile("file.txt", tmpFile);
        stream.on("finish", function(){
          fs.readFile(tmpFile, "utf8", function(err, text){
            if(err){
              done(err);
            }
            text.should.equal("12345");
            done();
          });
        });
      });
      it("should download file to destination stream", function(done){
        var order = new ImportTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        var stream = order.getFile("file.txt", fs.createWriteStream(tmpFile));
        stream.on("finish", function(){
          fs.readFile(tmpFile, "utf8", function(err, text){
            if(err){
              done(err);
            }
            text.should.equal("12345");
            done();
          });
        });
      });
      it("should allow control download process", function(done){
        var order = new ImportTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        var stream = order.getFile("file.txt").pipe(fs.createWriteStream(tmpFile));
        stream.on("finish", function(){
          fs.readFile(tmpFile, "utf8", function(err, text){
            if(err){
              done(err);
            }
            text.should.equal("12345");
            done();
          });
        });
      });
    });
    describe("#createFile", function(){
      var order, tmpFile = path.join(os.tmpdir(), "dest.txt");
      beforeEach(function(done){
        helper.nock().post("/accounts/FakeAccountId/importtnorders/1/loas", "12345", {"Content-Type": "text/plain"}).reply(200, helper.xml.fileCreated, {"Content-Type": "application/xml"});
        order = new ImportTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        fs.writeFile(tmpFile, "12345", "utf8", done);
      });
      afterEach(function(done){
        nock.cleanAll();
        fs.unlink(tmpFile, done);
      });
      it("should upload file to the server (via buffer)", function(done){
        order.createFile(new Buffer.from("12345", "utf8"), "text/plain", function(err, fileName){
          if(err){
            return done(err);
          }
          fileName.should.equal("test.txt");
          done();
        });
      });
      it("should upload file to the server (via file path)", function(done){
        order.createFile(tmpFile, "text/plain", function(err, fileName){
          if(err){
            return done(err);
          }
          fileName.should.equal("test.txt");
          done();
        });
      });
      it("should upload file to the server (via stream)", function(done){
        order.createFile(fs.createReadStream(tmpFile), "text/plain", function(err, fileName){
          if(err){
            return done(err);
          }
          fileName.should.equal("test.txt");
          done();
        });
      });
      it("should fail on error status code", function(done){
        nock.cleanAll();
        helper.nock().post("/accounts/FakeAccountId/importtnorders/1/loas", "11111", {"Content-Type": "text/plain"}).reply(400);
        order.createFile(new Buffer.from("11111", "utf8"), "text/plain", function(err, fileName){
          if(err){
            return done();
          }
          done(new Error("An error was expected"));
        });
      });
      it("should upload file to the server (default media type)", function(done){
        nock.cleanAll();
        helper.nock().post("/accounts/FakeAccountId/importtnorders/1/loas", "12345", {"Content-Type": "application/octet-stream"}).reply(200, helper.xml.fileCreated, {"Content-Type": "application/xml"});
        order.createFile(new Buffer.from("12345", "utf8"), function(err, fileName){
          if(err){
            return done(err);
          }
          fileName.should.equal("test.txt");
          done();
        });
      });
    });
    describe("#updateFile", function(){
      var order, tmpFile = path.join(os.tmpdir(), "dest.txt");
      beforeEach(function(done){
        helper.nock().put("/accounts/FakeAccountId/importtnorders/1/loas/test.txt", "12345", {"Content-Type": "text/plain"}).reply(200);
        order = new ImportTnOrder();
        order.id = 1;
        order.client = helper.createClient();
        fs.writeFile(tmpFile, "12345", "utf8", done);
      });
      afterEach(function(done){
        nock.cleanAll();
        fs.unlink(tmpFile, done);
      });
      it("should upload file to the server (via buffer)", function(done){
        order.updateFile("test.txt", new Buffer.from("12345", "utf8"), "text/plain", done);
      });
      it("should upload file to the server (via file path)", function(done){
        order.updateFile("test.txt", tmpFile, "text/plain", done);
      });
      it("should upload file to the server (via stream)", function(done){
        order.updateFile("test.txt", fs.createReadStream(tmpFile), "text/plain", done);
      });
      it("should fail on error status code", function(done){
        nock.cleanAll();
        helper.nock().put("/accounts/FakeAccountId/importtnorders/1/loas/test.txt", "11111", {"Content-Type": "text/plain"}).reply(400);
        order.updateFile("test.txt", new Buffer.from("11111", "utf8"), "text/plain", function(err){
          if(err){
            return done();
          }
          done(new Error("An error was expected"));
        });
      });
      it("should upload file to the server (default media type)", function(done){
        nock.cleanAll();
        helper.nock().put("/accounts/FakeAccountId/importtnorders/1/loas/test.txt", "12345", {"Content-Type": "application/octet-stream"}).reply(200, helper.xml.fileCreated, {"Content-Type": "application/xml"});
        order.updateFile("test.txt", new Buffer.from("12345", "utf8"), done);
      });
    });
  });
});
