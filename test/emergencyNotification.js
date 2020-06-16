var lib = require("../");
var helper = require("./helper");
var nock = require("nock");
var EmergencyNotification = lib.EmergencyNotification;

describe("EmergencyNotification", function(){
  before(function(){
    nock.disableNetConnect();
    helper.setupGlobalOptions();
  });
  after(function(){
    nock.cleanAll();
    nock.enableNetConnect();
  });
  describe("#listRecipients", function(){
    it("should return list of recipients", function(done){
        var recipientXML = `<EmergencyNotificationRecipientsResponse>
        <Links>
            <first> -- link to first page of results -- </first>
            <next> -- link to next page of results -- </next>
        </Links>
        <EmergencyNotificationRecipients>
            <EmergencyNotificationRecipient>
                <Identifier> 63865500-0904-46b1-9b4f-7bd237a26363 </Identifier>
                <CreatedDate>2020-03-18T21:26:47.403Z</CreatedDate>
                <LastModifiedDate>2020-03-18T21:26:47.403Z</LastModifiedDate>
                <ModifiedByUser>jgilmore</ModifiedByUser>
                <Description> This is a description of the emergency notification recipient. </Description>
                <Type>CALLBACK</Type>
                <Callback>
                    <Url>https://foo.bar/baz</Url>
                    <Credentials>
                        <Username>jgilmore</Username>
                    </Credentials>
                </Callback>
            </EmergencyNotificationRecipient>
            <EmergencyNotificationRecipient>
                <Identifier> 63865500-0904-46b1-9b4f-7bd237a26363 </Identifier>
                <CreatedDate>2020-03-22T12:13:25.782Z</CreatedDate>
                <LastModifiedDate>2020-03-22T12:13:25.782Z</LastModifiedDate>
                <ModifiedByUser>gfranklin</ModifiedByUser>
                <Description> This is a description of the emergency notification recipient. </Description>
                <Type>EMAIL</Type>
                <EmailAddress>fred@gmail.com</EmailAddress>
            </EmergencyNotificationRecipient>
            <EmergencyNotificationRecipient>
                <Identifier> 63865500-0904-46b1-9b4f-7bd237a26363 </Identifier>
                <CreatedDate>2020-03-25T17:04:53.042Z</CreatedDate>
                <LastModifiedDate>2020-03-25T17:04:53.042Z</LastModifiedDate>
                <ModifiedByUser>msimpson</ModifiedByUser>
                <Description> This is a description of the emergency notification recipient. </Description>
                <Type>SMS</Type>
                <Sms>
                    <TelephoneNumber>12015551212</TelephoneNumber>
                </Sms>
            </EmergencyNotificationRecipient>
            <EmergencyNotificationRecipient>
                <Identifier> 63865500-0904-46b1-9b4f-7bd237a26363 </Identifier>
                <CreatedDate>2020-03-29T20:14:01.736Z</CreatedDate>
                <LastModifiedDate>2020-03-29T20:17:53.294Z</LastModifiedDate>
                <ModifiedByUser>lsimpson</ModifiedByUser>
                <Description> This is a description of the emergency notification recipient. </Description>
                <Type>TTS</Type>
                <Tts>
                    <TelephoneNumber>12015551212</TelephoneNumber>
                </Tts>
            </EmergencyNotificationRecipient>
        </EmergencyNotificationRecipients>
    </EmergencyNotificationRecipientsResponse>`


      var span = helper.nock()
        .get("/accounts/FakeAccountId/emergencyNotificationRecipients")
        .query({query: "param"})
        .reply(200, recipientXML, {"Content-Type": "application/xml"});

      EmergencyNotification.listRecipients(helper.createClient(), {"query": "param"}, function(err, res){
        if(err){
          return done(err);
        }       

        try{
            span.isDone().should.be.true;
            res.links.first.should.equal(" -- link to first page of results -- ");
            res.emergencyNotificationRecipients.emergencyNotificationRecipient.length.should.equal(4);

            var list = res.emergencyNotificationRecipients.emergencyNotificationRecipient;

            list[0].identifier.should.equal(" 63865500-0904-46b1-9b4f-7bd237a26363 ");
            list[0].modifiedByUser.should.equal("jgilmore");
            list[0].description.should.equal(" This is a description of the emergency notification recipient. ");
            list[0].type.should.equal("CALLBACK");
            list[0].callback.url.should.equal("https://foo.bar/baz");
            list[0].callback.credentials.username.should.equal("jgilmore");
        } catch (err) {
            done(err);
            return;
        }

        done();
      });
    });
  });
  describe("#getRecipient", function(){
    it("should return a recipient", function(done){
        var recipientXML = `<EmergencyNotificationRecipientsResponse>
        <EmergencyNotificationRecipient>
            <Identifier> 63865500-0904-46b1-9b4f-7bd237a26363 </Identifier>
            <CreatedDate>2020-03-18T21:26:47.403Z</CreatedDate>
            <LastModifiedDate>2020-04-01T18:32:22.316Z</LastModifiedDate>
            <ModifiedByUser>jgilmore</ModifiedByUser>
            <Description> This is a description of the emergency notification recipient. </Description>
            <Type>CALLBACK</Type>
            <Callback>
                <Url>https://foo.bar/baz</Url>
                <Credentials>
                    <Username>jgilmore</Username>
                    <!-- CallbackPassword is omitted for security -->
                </Credentials>
            </Callback>
        </EmergencyNotificationRecipient>
    </EmergencyNotificationRecipientsResponse>
    `

        var id = "123";
        var span = helper.nock()
            .get(`/accounts/FakeAccountId/emergencyNotificationRecipients/${id}`)
            .reply(200, recipientXML, {"Content-Type": "application/xml"});

        EmergencyNotification.getRecipient(helper.createClient(), id , function(err, res){
            if(err){
                return done(err);
            }
            
            try{
                span.isDone().should.be.true;
                JSON.stringify(res).should.equal(`{"emergencyNotificationRecipient":{"identifier":" 63865500-0904-46b1-9b4f-7bd237a26363 ","createdDate":"2020-03-18T21:26:47.403Z","lastModifiedDate":"2020-04-01T18:32:22.316Z","modifiedByUser":"jgilmore","description":" This is a description of the emergency notification recipient. ","type":"CALLBACK","callback":{"url":"https://foo.bar/baz","credentials":{"username":"jgilmore"}}},"client":{"xml2jsParserOptions":{"explicitArray":false,"tagNameProcessors":[null,null],"async":true}}}`);
            } catch (err) {
                done(err);
                return;
            }

        done();
      });
    });
  });
  describe("#createRecipient", function(){
    it("should create a recipient", function(done){
        var recipientXML = `<EmergencyNotificationRecipientsResponse>
        <EmergencyNotificationRecipient>
            <Identifier> 63865500-0904-46b1-9b4f-7bd237a26363 </Identifier>
            <CreatedDate>2020-03-18T21:26:47.403Z</CreatedDate>
            <LastModifiedDate>2020-04-01T18:32:22.316Z</LastModifiedDate>
            <ModifiedByUser>jgilmore</ModifiedByUser>
            <Description> This is a description of the emergency notification recipient. </Description>
            <Type>CALLBACK</Type>
            <Callback>
                <Url>https://foo.bar/baz</Url>
                <Credentials>
                    <Username>jgilmore</Username>
                    <!-- CallbackPassword is omitted for security -->
                </Credentials>
            </Callback>
        </EmergencyNotificationRecipient>
    </EmergencyNotificationRecipientsResponse>`

        var recipient = {props : {feilds: {}}};

        var span = helper.nock()
            .post("/accounts/FakeAccountId/emergencyNotificationRecipients", helper.buildXml(recipient))
            .reply(200, recipientXML, {"Content-Type": "application/xml"});

        EmergencyNotification.createRecipient(helper.createClient(), recipient, function(err, res){
            if(err){
                return done(err);
            }
            
            try{
                span.isDone().should.be.true;
                JSON.stringify(res).should.equal(`{"emergencyNotificationRecipient":{"identifier":" 63865500-0904-46b1-9b4f-7bd237a26363 ","createdDate":"2020-03-18T21:26:47.403Z","lastModifiedDate":"2020-04-01T18:32:22.316Z","modifiedByUser":"jgilmore","description":" This is a description of the emergency notification recipient. ","type":"CALLBACK","callback":{"url":"https://foo.bar/baz","credentials":{"username":"jgilmore"}}},"client":{"xml2jsParserOptions":{"explicitArray":false,"tagNameProcessors":[null,null],"async":true}}}`);
            } catch (err) {
                done(err);
                return;
            }

        done();
      });
    });
  });
  describe("#replaceRecipient", function(){
    it("should create a recipient", function(done){
        var recipientXML = `<EmergencyNotificationRecipientsResponse>
        <EmergencyNotificationRecipient>
            <Identifier> 63865500-0904-46b1-9b4f-7bd237a26363 </Identifier>
            <CreatedDate>2020-03-18T21:26:47.403Z</CreatedDate>
            <LastModifiedDate>2020-04-01T18:32:22.316Z</LastModifiedDate>
            <ModifiedByUser>jgilmore</ModifiedByUser>
            <Description> This is a description of the emergency notification recipient. </Description>
            <Type>CALLBACK</Type>
            <Callback>
                <Url>https://foo.bar/baz</Url>
                <Credentials>
                    <Username>jgilmore</Username>
                    <!-- CallbackPassword is omitted for security -->
                </Credentials>
            </Callback>
        </EmergencyNotificationRecipient>
    </EmergencyNotificationRecipientsResponse>`

        var recipient = {props : {feilds: {}}};

        var enr = new EmergencyNotification();
        enr.enrid = 123;

        var span = helper.nock()
            .put(`/accounts/FakeAccountId/emergencyNotificationRecipients/${enr.enrid}`, helper.buildXml(recipient))
            .reply(200, recipientXML, {"Content-Type": "application/xml"});

        var enr = new EmergencyNotification();
        enr.enrid = 123;

        enr.replaceRecipient(helper.createClient(), recipient, function(err, res){
            if(err){
                return done(err);
            }
            
            try{
                span.isDone().should.be.true;
                JSON.stringify(res).should.equal(`{"emergencyNotificationRecipient":{"identifier":" 63865500-0904-46b1-9b4f-7bd237a26363 ","createdDate":"2020-03-18T21:26:47.403Z","lastModifiedDate":"2020-04-01T18:32:22.316Z","modifiedByUser":"jgilmore","description":" This is a description of the emergency notification recipient. ","type":"CALLBACK","callback":{"url":"https://foo.bar/baz","credentials":{"username":"jgilmore"}}},"client":{"xml2jsParserOptions":{"explicitArray":false,"tagNameProcessors":[null,null],"async":true}}}`);
            } catch (err) {
                done(err);
                return;
            }

        done();
      });
    });
  });
  describe("#deleteRecipient", function() {
    it("should delete a recipient", function(done){
        
        var enr = new EmergencyNotification();
        enr.enrid = 123;

        var span = helper.nock()
            .put(`/accounts/FakeAccountId/emergencyNotificationRecipients/${enr.enrid}`)
            .reply(200);

        var enr = new EmergencyNotification();
        enr.enrid = 123;

        enr.deleteRecipient(helper.createClient(), function(err, res){
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
  describe("#listGroupOrders", function(){
    it("should list group orders", function(done){
        var responseXML = `<EmergencyNotificationGroupOrderResponse>
        <Links>
            <first>link</first>
        </Links>
        <EmergencyNotificationGroupOrders>
            <EmergencyNotificationGroupOrder>
                <OrderId>092815dc-9ced-4d67-a070-a80eb243b914</OrderId>
                <OrderCreatedDate>2020-04-29T15:40:01.449Z</OrderCreatedDate>
                <CreatedBy>systemUser</CreatedBy>
                <ProcessingStatus>COMPLETED</ProcessingStatus>
                <CustomerOrderId>QTWeKMys</CustomerOrderId>
                <AddedEmergencyNotificationGroup>
                    <Identifier>6daa55e1-e499-4cf0-9f3d-9524215f1bee</Identifier>
                    <Description>enr test description 3</Description>
                    <AddedEmergencyNotificationRecipients>
                        <EmergencyNotificationRecipient>
                            <Identifier>44f203915ca249b7b69bbc084af09a</Identifier>
                            <Description>TestDesc SEHsbDMM</Description>
                            <Type>SMS</Type>
                            <Sms>
                                <TelephoneNumber>15638765448</TelephoneNumber>
                            </Sms>
                        </EmergencyNotificationRecipient>
                    </AddedEmergencyNotificationRecipients>
                </AddedEmergencyNotificationGroup>
            </EmergencyNotificationGroupOrder>
            <EmergencyNotificationGroupOrder>
                <OrderId>89b4e0a1-2789-43fb-b948-38d368159142</OrderId>
                <OrderCreatedDate>2020-04-29T15:39:59.325Z</OrderCreatedDate>
                <CreatedBy>systemUser</CreatedBy>
                <ProcessingStatus>COMPLETED</ProcessingStatus>
                <CustomerOrderId>SDWupQpf</CustomerOrderId>
                <AddedEmergencyNotificationGroup>
                    <Identifier>b49fa543-5bb3-4b9d-9213-96c8b63e77f5</Identifier>
                    <Description>enr test description 2</Description>
                    <AddedEmergencyNotificationRecipients>
                        <EmergencyNotificationRecipient>
                            <Identifier>c719e060a6ba4212a2c0642b87a784</Identifier>
                            <Description>TestDesc zscxcAGG</Description>
                            <Type>SMS</Type>
                            <Sms>
                                <TelephoneNumber>15678765448</TelephoneNumber>
                            </Sms>
                        </EmergencyNotificationRecipient>
                        <EmergencyNotificationRecipient>
                            <Identifier>93ad72dfe59c4992be6f8aa625466d</Identifier>
                            <Description>TestDesc RTflsKBz</Description>
                            <Type>TTS</Type>
                            <Tts>
                                <TelephoneNumber>17678765449</TelephoneNumber>
                            </Tts>
                        </EmergencyNotificationRecipient>
                    </AddedEmergencyNotificationRecipients>
                </AddedEmergencyNotificationGroup>
            </EmergencyNotificationGroupOrder>
            <EmergencyNotificationGroupOrder>
                <OrderId>247d1425-4247-4b27-99d8-83ce30038b14</OrderId>
                <OrderCreatedDate>2020-04-29T15:39:57.058Z</OrderCreatedDate>
                <CreatedBy>systemUser</CreatedBy>
                <ProcessingStatus>COMPLETED</ProcessingStatus>
                <CustomerOrderId>vgshuNMB</CustomerOrderId>
                <AddedEmergencyNotificationGroup>
                    <Identifier>69a3d588-f314-42ca-8726-faa824bdf4be</Identifier>
                    <Description>eng test description</Description>
                    <AddedEmergencyNotificationRecipients>
                        <EmergencyNotificationRecipient>
                            <Identifier>aab78f87074940f1aaaf1c9658be4b</Identifier>
                            <Description>enr test description</Description>
                            <Type>EMAIL</Type>
                            <EmailAddress>testEmail@gmail.com</EmailAddress>
                        </EmergencyNotificationRecipient>
                        <EmergencyNotificationRecipient>
                            <Identifier>852e9eee161b4da6823c91173b05c4</Identifier>
                            <Description>TestDesc WkHqpnNH</Description>
                            <Type>TTS</Type>
                            <Tts>
                                <TelephoneNumber>15678765449</TelephoneNumber>
                            </Tts>
                        </EmergencyNotificationRecipient>
                    </AddedEmergencyNotificationRecipients>
                </AddedEmergencyNotificationGroup>
            </EmergencyNotificationGroupOrder>
        </EmergencyNotificationGroupOrders>
    </EmergencyNotificationGroupOrderResponse>`;

        var span = helper.nock()
            .get(`/accounts/FakeAccountId/emergencyNotificationGroupOrders`)
            .query({query: "param"})
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.listGroupOrders(helper.createClient(), {query: "param"}, function(err, res){
            if(err){
                return done(err);
            }
            
            try{
                span.isDone().should.be.true;
                JSON.stringify(res).should.equal(`{"links":{"first":"link"},"emergencyNotificationGroupOrders":{"emergencyNotificationGroupOrder":[{"orderId":"092815dc-9ced-4d67-a070-a80eb243b914","orderCreatedDate":"2020-04-29T15:40:01.449Z","createdBy":"systemUser","processingStatus":"COMPLETED","customerOrderId":"QTWeKMys","addedEmergencyNotificationGroup":{"identifier":"6daa55e1-e499-4cf0-9f3d-9524215f1bee","description":"enr test description 3","addedEmergencyNotificationRecipients":{"emergencyNotificationRecipient":{"identifier":"44f203915ca249b7b69bbc084af09a","description":"TestDesc SEHsbDMM","type":"SMS","sms":{"telephoneNumber":"15638765448"}}}}},{"orderId":"89b4e0a1-2789-43fb-b948-38d368159142","orderCreatedDate":"2020-04-29T15:39:59.325Z","createdBy":"systemUser","processingStatus":"COMPLETED","customerOrderId":"SDWupQpf","addedEmergencyNotificationGroup":{"identifier":"b49fa543-5bb3-4b9d-9213-96c8b63e77f5","description":"enr test description 2","addedEmergencyNotificationRecipients":{"emergencyNotificationRecipient":[{"identifier":"c719e060a6ba4212a2c0642b87a784","description":"TestDesc zscxcAGG","type":"SMS","sms":{"telephoneNumber":"15678765448"}},{"identifier":"93ad72dfe59c4992be6f8aa625466d","description":"TestDesc RTflsKBz","type":"TTS","tts":{"telephoneNumber":"17678765449"}}]}}},{"orderId":"247d1425-4247-4b27-99d8-83ce30038b14","orderCreatedDate":"2020-04-29T15:39:57.058Z","createdBy":"systemUser","processingStatus":"COMPLETED","customerOrderId":"vgshuNMB","addedEmergencyNotificationGroup":{"identifier":"69a3d588-f314-42ca-8726-faa824bdf4be","description":"eng test description","addedEmergencyNotificationRecipients":{"emergencyNotificationRecipient":[{"identifier":"aab78f87074940f1aaaf1c9658be4b","description":"enr test description","type":"EMAIL","emailAddress":"testEmail@gmail.com"},{"identifier":"852e9eee161b4da6823c91173b05c4","description":"TestDesc WkHqpnNH","type":"TTS","tts":{"telephoneNumber":"15678765449"}}]}}}]},"client":{"xml2jsParserOptions":{"explicitArray":false,"tagNameProcessors":[null,null],"async":true}}}`);
            } catch (err) {
                done(err);
                return;
            }

        done();
      });
    });
  });
  describe("#getGroupOrder", function(){
    it("should get group orders by id", function(done){
        var responseXML = ``;

        var id = 123;

        var span = helper.nock()
            .get(`/accounts/FakeAccountId/emergencyNotificationGroupOrders/${id}`)
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.getGroupOrder(helper.createClient(), id, function(err, res){
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
  describe("#createGroupOrder", function(){
    it("should creat a group order", function(done){
        var responseXML = ``;

        var groupOrder = {top: {field: "value"}}

        var span = helper.nock()
            .post(`/accounts/FakeAccountId/emergencyNotificationGroupOrders`)
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.createGroupOrder(helper.createClient(), groupOrder , function(err, res){
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
  describe("#listGroup", function(){
    it("should list group orders", function(done){
        var responseXML = ``;

        var query = {query: "params"}

        var span = helper.nock()
            .get(`/accounts/FakeAccountId/emergencyNotificationGroups`)
            .query(query)
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.listGroups(helper.createClient(), query , function(err, res){
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
  describe("#getGroup", function(){
    it("should get a group", function(done){
        var responseXML = ``;

        var id = 123

        var span = helper.nock()
            .get(`/accounts/FakeAccountId/emergencyNotificationGroups/${id}`)
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.getGroup(helper.createClient(), id , function(err, res){
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
  describe("#listEnpointOrders", function(done){
    it("should list endpoint orders", function(done){
        var responseXML = ``;

        var query = {query: "params"}

        var span = helper.nock()
            .get(`/accounts/FakeAccountId/emergencyNotificationEndpointOrders`)
            .query(query)
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.listEnpointOrders(helper.createClient(), query , function(err, res){
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
  describe("#getEndpointOrders", function(done){
    it("should get an endpoint order", function(done){
        var responseXML = ``;

        var id = 123;

        var span = helper.nock()
            .get(`/accounts/FakeAccountId/emergencyNotificationEndpointOrders/${id}`)
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.getEndpointOrder(helper.createClient(), id , function(err, res){
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
  describe("#createEndpointOrders", function(done){
    it("should get an endpoint order", function(done){
        var responseXML = ``;

        var endpoint = {top: {data: "value"}};

        var span = helper.nock()
            .post(`/accounts/FakeAccountId/emergencyNotificationEndpointOrders`, helper.buildXml(endpoint))
            .reply(200, responseXML, {"Content-Type": "application/xml"});

        EmergencyNotification.createEndpointOrder(helper.createClient(), endpoint , function(err, res){
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
