# node-numbers

NodeJs Client library for Bandwidth Numbers API

## Other Node SDKs
* Messaging: https://github.com/Bandwidth/node-messaging
* Voice: https://github.com/Bandwidth/node-voice

## Supported Versions
This SDK stable for node versions 7 and above

| Version | Support Level |           |
|:--------|:--------------|:----------|
| <7      | Unsupported   |           |
| > 7     |               | Supported |

## Release Notes
| Version | Notes                                                                                                                                     |
|:--------|:------------------------------------------------------------------------------------------------------------------------------------------|
| 1.1.0   | Added import tn functionality, added promise based `Async` functions                                                                      |
| 1.2.0   | Added CSR lookup functionality                                                                                                            |
| 1.2.1   | Fixed Subscription List functionality. Example code at: [examples/subscription_list_and_delete](examples/subscription_list_and_delete.js) |
| 1.2.2   | Readme Typo for `RemoveImportedTnOrder`                                                                                                   |
| 1.3.0 | Added Emergency Calling Notification endpoints                                                                                              |
| 1.4.0   | Added TnOptions endpoints and functionality, along with SMS options on sip peers.                                                         |
| 1.6.0 | Added create origination settings for sip peers |


## Install

Run

```
npm install @bandwidth/numbers
```

## Usage

```js
var numbers = require("@bandwidth/numbers");

//Using client directly
var client = new numbers.Client("accountId", "userName", "password");
numbers.Site.list(client, function(err, sites){...});

//Or you can use default client instance (do this only once)
numbers.Client.globalOptions.accountId = "accountId";
numbers.Client.globalOptions.userName = "userName";
numbers.Client.globalOptions.password = "password";

//Now you can call any functions without first arg 'client'

numbers.Site.list(function(err, sites){
  //Default client will be used to do this call
});

```

## Async Methods

Each API Call also contains an async method that returns a promise for use with `.then` or `async`/`await`.

The async method is the original method name with `Async` added.

### Some Examples

* `numbers.Site.create` : `numbers.Site.createAsync`
* `numbers.AvailableNumbers.list` : `numbers.AvailableNumbers.listAsync`
* `numbers.Order.create`: `numbers.Order.createAsync`

### Example for listing Available Numbers

#### Callbacks

```js
// Callbacks
numbers.AvailableNumbers.list(query, (err, availableNumbers) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log(availableNumbers);
  }
});
```

#### Promise Chaining
```js
//Promise chaining
numbers.AvailableNumbers.listAsync(query)
.then(availableNumbers => {
  console.log(availableNumbers);
})
.catch(e => {
  console.log(e);
});

```

#### Async/Await
```js
//Async/await
try {
  const availableNumbers = await numbers.AvailableNumbers.listAsync(query);
  console.log(availableNumbers);
}
catch (e) {
  console.log(e)
}

```

## Examples
There is an 'examples' folder in the source tree that shows how each of the API objects work with simple example code.  To run the examples:

```bash
$ cd examples
$ cp config.js.example config.js
```
Edit the config.js to match your IRIS credentials and run the examples individually.  e.g.

```bash
node coveredRateCenters-sample.js
```
If the examples take command line parameters, you will get the usage by just executing the individual script.


## API Objects
### General principles
When fetching objects from the API, it will always return an object that has the client
instantiated so that you can call dependent methods as well as update, delete.

Example:

```Javascript
numbers.Site.create({siteObject}, function(err,item){
  console.log("the site ID is: " + item.id);
  item.delete(function(err,res){ //no need to pass the client again
  });
});
```

Each entity has a get, list, create, update and delete method if appropriate.

All properties are camel-cased for Javascript readability, and are converted on the fly to the proper
case by the internals of the API when converted to XML.


## Applications
### Create Voice Application

```Javascript
var data = {
  appName:"test app",
  callInitiatedCallbackUrl: "http://example.com",
  callInitiatedMethod: "POST",
  callStatusCallbackUrl: "http://example.com",
  callStatusMethod: "POST"
  callbackCreds: {
    userId: 'my-id',
    password: 'my-password'
  }
};

numbers.Application.createVoiceApplication(data, callback);
```

### Create Messaging Application

```Javascript
var data = {
  appName:"test app",
  msgCallbackUrl: "http://example.com",
  callbackCreds: {
    userId: 'my-id',
    password: 'my-password'
  }
};

numbers.Application.createMessagingApplication(data, callback);
```

### List All Applications

```Javascript
numbers.Application.list(callback);
```

### Get an Application
```Javascript
numbers.Application.get(id, callback);
```

### Update an Application
```Javascript
numbers.Application.get(id, (err, app) => {
  app.appName = "new name";
  app.update(app, callback);
});
```

### Delete an Application
```Javascript
numbers.Application.get(id, (err, app) => {
  app.delete(callback)
});
```

### Get SipPeers Associated With and Application
```Javascript
numbers.Application.get(id, (err, app) => {
  app.getSipPeers(callback);
});
```

## Available Numbers

### Available Numbers Area Code

```Javascript
var res = await numbers.AvailableNumbers.listAsync({areaCode:"919", quantity:"5"});
console.log(res);
```

### Available Numbers Area Code And Local Vanity

```Javascript
var res = await numbers.AvailableNumbers.listAsync({areaCode:"919", localVanity:"298", quantity:"5"});
console.log(res);

res = await numbers.AvailableNumbers.listAsync({areaCode:"919", localVanity:"2982", quantity:"5"});
console.log(res);

res = await numbers.AvailableNumbers.listAsync({areaCode:"919", localVanity:"29822", quantity:"5"});
console.log(res);

res = await numbers.AvailableNumbers.listAsync({areaCode:"919", localVanity:"298227", quantity:"5"});
console.log(res);

res = await numbers.AvailableNumbers.listAsync({areaCode:"919", localVanity:"2982272", quantity:"5"});
console.log(res);
```

## Available NpaNxx

```Javascript
numbers.AvailableNpaNxx.list({areaCode:"818", quantity:5}, callback);
```

## Cities

```Javascript
numbers.City.list({"available":true, "state":"CA"}, callback);
```

## Covered Rate Centers

```Javascript
numbers.CoveredRateCenter.list({"zip":"27601"}, callback);
```

## Disconnected Numbers
Retrieves a list of disconnected numbers for an account

```Javascript
numbers.DiscNumber.list({"areaCode":"919"}, callback);
```

## Disconnect Numbers
The Disconnect object is used to disconnect numbers from an account.  Creates a disconnect order that can be tracked

### Create Disconnect

```Javascript
numbers.Disconnect.create("Disconnect Order Name", ["9195551212", "9195551213"], callback);
```

### Get Disconnect

```Javascript
numbers.Disconnect.get("orderId", {tnDetail:true}, callback);
```

### Add Note to Disconnect

```Javascript
var note = {userId: "my id", description: "Test"};
numbers.Disconnect.get("orderId", {tnDetail:true}, function(err,order){
  order.addNote(note, callback);
});
```

### Get Notes for Disconnect

```Javascript
numbers.Disconnect.get("orderId", {tnDetail:true}, function(err,order){
  order.getNotes(callback);
});
```

## Dlda

### Create Ddla

```Javascript
var dlda = {
  customerOrderId:"Your Order Id",
  dldaTnGroups: [
    dldaTnGroup: {
      telephoneNumbers: ["9195551212"],
      subscriberType: "RESIDENTIAL",
      listingType: "LISTED",
      listingName:{
        firstName:"John",
        lastName:"Smith"
      },
      listAddress:true,
      address:{
        houseNumber: "123",
        streetName: "Elm",
        streetSuffix: "Ave",
        city: "Carpinteria",
        stateCode:"CA",
        zip:"93013",
        addressType: "DLDA"
      }
    }
  ]
}

numbers.Dlda.create(dlda, callback);
```

### Get Dlda

```Javascript
numbers.Dlda.get(id, callback);
```

### Get Dlda History

```Javascript
numbers.Dlda.get(id, function(err,dlda){
  dlda.getHistory(callback);
});
```

### List Dldas

```Javascript
numbers.Dlda.list({telephoneNumber:"9195551212"}, callback);
```

## Import To Account
This path is generally not available to Bandwidth accounts, and as such is not documented in this API

## In Service Numbers

### List InService Numbers

```Javascript
numbers.InServiceNumber.list({"areaCode":"919"}, callback);
```

### Get InService Number Detail

```Javascript
numbers.InServiceNumber.get("9195551212", callback);
```

## Lidb

### Create

```Javascript
var data = {
  customerOrderId:"A test order",
  lidbTnGroups:{
    lidbTnGroup:{
      telephoneNumbers:["8048030097", "8045030098"],
      subscriberInformation:"Joes Grarage",
      useType: "RESIDENTIAL",
      visibility: "PUBLIC"
    }
  }
}
numbers.Lidbs.create(data, callback);
```
### Get Lidb

```Javascript
numbers.Lidbs.get(id, callback);
```
### List Lidbs

```Javascript
numbers.Lidbs.list({telephoneNumber:"9195551212"}, callback);
```

## LNP Checker
### Check LNP

```Javascript
var numbersList = ["9195551212", "9195551213"];
var fullCheck = true;
numbers.LnpChecker.check(numbersList, fullCheck, callback);
```

## LSR Orders
### Create LSR Order

```Javascript
var data = {
  pon:"Some Pon",
  customerOrderId: "MyId5",
  sPID:"123C",
  billingTelephoneNumber:"9192381468",
  requestedFocDate: "2015-11-15",
  authorizingPerson: "Jim Hopkins",
  subscriber:{
    subscriberType:"BUSINESS",
    businessName:"BusinessName",
    serviceAddress: {
      houseNumber:"11",
      streetName: "Park",
      streetSuffix: "Ave",
      city:"New York",
      stateCode: "NY",
      zip: "90025"
    },
    accountNumber:"123463",
    pinNumber:"1231"
  },
  listOfTelephoneNumbers: {
    telephoneNumber:["9192381848", "9192381467"]
  }
};

numbers.LsrOrder.create(data, callback);
```

### Get LSR Order

```Javascript
numbers.LsrOrder.get(id, callback);
```

### List LSR Orders

```Javascript
numbers.LsrOrder.list({pon:"Some Pon"}, callback);
```

### Update LSR Order

```Javascript
numbers.LsrOrder.get("id", function(err, order){
  order.requestedFocDate = "2015-11-16";
  numbers.LsrOrder.update(order, callback);
})
```
### Get LSR Order History

```Javascript
numbers.LsrOrder.get("id", function(err, order){
  order.getHistory(callback);
});
```

### Get LSR Order Notes

```Javascript
numbers.LsrOrder.get("id", function(err,order){
  order.getNotes(callback);
});
```

### Add LSR Order Note

```Javascript
var note = {userId: "my id", description: "Test"};
numbers.LsrOrder.get("id", function(err, order){
  order.addNote(note, callback);
});
```

## Orders
### Create Order

```Javascript
var order = {
  name:"A Test Order",
  siteId: 1111,
  existingTelephoneNumberOrderType: {
    telephoneNumberList:[
      {
        telephoneNumber:"9195551212"
      }
    ]
  }
};

numbers.Order.create(order, callback);
```

### Get Order

```Javascript
numbers.Order.get(id, callback);
```

### List Orders

```Javascript
numbers.Order.list(query, callback);
```

### List Area Codes for Order

```Javascript
numbers.Order.get(id, function(err, order){
  order.getAreaCodes(callback);
});

```

### Order Instance Methods

```Javascript
// get Area Codes
order.getAreaCodes(callback);

// add note to order
var note = {userId: "my id", description: "Test"};
order.addNote(note,callback);

//get Npa Nxxs
order.getNpaNxx(callback);

// get number totals
order.getTotals(callback);

// get all Tns for an order
order.getTns(callback)

// get order history
order.getHistory(callback);

// get order notes
order.getNotes(callback);
```

## Port Ins
### Create PortIn
```Javascript
var data = {
  siteId:1234,
  peerId:5678,
  billingTelephoneNumber: "9195551212",
  subscriber: {
    subscriberType: "BUSINESS",
    businessName: "Company",
    serviceAddress: {
      houseNumber: "123",
      streetName: "EZ Street",
      city: "Raleigh",
      stateCode: "NC",
      county: "Wake"
    }
  },
  loaAuthorizingPerson: "Joe Blow",
  listOfPhoneNumbers: {
    phoneNumber:["9195551212"]
  },
  billingType: "PORTIN"
};

numbers.PortIn.create(data, callback);
```

## Get PortIn

```Javascript
numbers.PortIn.get("id", callback)
```

## List PortIns

``` Javascript
var query = {pon:"a pon"};
numbers.PortIn.list(query, function(err, list){
  console.log(JSON.stringify(list));
});
```

### PortIn Instance methods

```Javascript
// fetch instance using PortIn.get(callback, portIn)
portIn.update(data, callback);
portIn.delete(callback);
portIn.getAreaCodes(callback);
portIn.getNpaNxx(callback);
portIn.getTotals(callback);
portIn.getTns(callback);
portIn.getNotes(callback);
portIn.addNote(callback);
portIn.getActivationStatus(callback);
```

### PortIn File Management

```Javascript

numbers.PortIn.get("id", function(err, portIn){
  // Add File
  portIn.createFile(fs.createReadStream("myFile.txt"), callback);

  // Update File
  portIn.updateFile("myFile.txt", fs.createReadStream("myFile.txt"), callback);

  // Get File
  portIn.getFile("myFile.txt", callback);

  // Get File Metadata
  portIn.getFileMetadata("myFile.txt", callback);

  // Get Files
  portIn.getFiles(callback);
});
```

## Port Out
### List PortOuts

```Javascript
var query = {"status":"complete"}
numbers.PortOut.list(query, callback);
```

### Get PortOut

```Javascript
numbers.PortOut.get(id, callback);
```

## Rate Centers
### List Ratecenters

```Javascript
var query = {"available":true, "state":"CA"}
numbers.RateCenter.list(query, callback);
```

## SIP Peers
### Create SIP Peer

```Javascript
var data = {
  peerName:"A New SIP Peer",
  isDefaultPeer:false,
  shortMessagingProtocol:"SMPP",
  siteId:selectedSite,
  voiceHosts:[
    {
      host:{
        hostName:"1.1.1.1"
      }
    }
  ],
  smsHosts:[
    {
      host:{
        hostName:"1.1.1.1"
      }
    }
  ],
  terminationHosts:[
    {
      terminationHost:{
        hostName:"1.1.1.1",
        port:5060,
      }
    }
  ]
};

numbers.SipPeer.create(data, callback);
```

### Get SIP Peer

```Javascript
numbers.SipPeer.get("id", callback);
```

### List SIP Peers

```Javascript
numbers.SipPeer.list(siteId, callback);
```

### Delete SIP Peer

```Javascript
numbers.SipPeer.get(function(err, sipPeer){
  sipPeer.delete(callback);
});
```

### SipPeer TN Methods

```Javascript
numbers.SipPeer.get(function(err,sipPeer){
  // get TN for this peer
  sipPeer.getTns(number, callback);

  // get all TNs for this peer
  sipPeer.getTns(callback);

  // Update TNs for this peer
  var tns = {fullNumber: "123456", rewriteUser: "test"};
  sipPeer.updateTns(number, tns, callback);

  // Move Tns to new peer
  var numbersToMove = ["9195551212", "9195551213"];
  sipPeer.moveTns(numbersToMove, callback);
});
```

### SipPeer link Application Methods

```Javascript
numbers.SipPeer.get(function(err,sipPeer){
  // List application associated with this peer
  sipPeer.listApplication(callback);

  // Associate an application with this peer
  var appId = "my-application-id";
  sipPeer.editApplication({httpMessagingV2AppId: appId}, callback);

  // Dissociate all applications with this peer
  sipPeer.removeApplication(callback);
```

### SipPeer SMS settings

```Javascript
numbers.SipPeer.get(function(err,sipPeer){
  // Get the sms settings associated with the peer
  sipPeer.getSmsSettings(callback);

  var desiredsettings = {
    sipPeerSmsFeatureSettings: {
      tollFree: true,
      zone1: false,
      zone2: true,
      protocol: "HTTP"
    }
  };
  //Change settings
  sipPeer.editSmsSettings(desiredsettings, callback);

  //Create settings
  sipPeer.createSmsSettings(desiredsettings, callback);

  //Delete
  sipPeer.deleteSmsSettings(callback);
```

### SipPeer SMS settings

```Javascript
numbers.SipPeer.get(function(err,sipPeer){
  // Get the mms settings associated with the peer
  sipPeer.getMmsSettings(callback);

  var desiredsettings = {
      mmsSettings: {
        protocol: 'HTTP'
      },
      protocols: {
        HTTP: {
          httpSettings: {
            proxyPeerId: 500017
          }
        }
      }
    }
  //Change settings
  sipPeer.editMmsSettings(desiredsettings, callback);

  //Create settings
  sipPeer.createMmsSettings(desiredsettings, callback);

  //Delete
  sipPeer.deleteMmsSettings(callback);
```



## Sites

### Create A Site
A site is what is called Location in the web UI.

```Javascript
var site = {
  name:"A new site",
  description:"A new description",
  address:{
    houseNumber: "123",
    streetName: "Anywhere St",
    city: "Raleigh",
    stateCode:"NC",
    zip: "27609",
    addressType: "Service"
  }
};
numbers.Site.create(site, callback);
```

### Updating a Site

```Javascript
site.name = "Some new name";
site.update(site, callback);
```

### Deleting a Site

```Javascript
site.delete(callback);
```
### Listing All Sites
```Javascript
numbers.Site.list(callback);
```

### Site Instance Methods

```Javascript
numbers.Site.get(id, function(err,site){
  // getInService numbers
  site.getInserviceNumbers(query, callback);

  // get Orders
  site.getOrders(query, callback);

  // get PortIns
  site.getPortIns(query, callback);

  // get Total Tns
  site.getTotalTns(query, callback);
});
```
### Site SipPeer Methods

```Javascript
numbers.Site.get(id, function(err,site){
  // get Sip Peers
  site.getSipPeers(callback);

  // get Sip Peer
  site.getSipPeer(id, callback);

  // create Sip Peer
  var sipPeer = {name:"SIP Peer"};
  site.createSipPeer(sipPeer, callback);
});
```

## Subscriptions
### Create Subscription

```Javascript
var subscription = {
  orderType:"orders",
  callbackSubscription: {
    URL:"http://mycallbackurl.com",
    user:"userid",
    expiry: 12000
  }
};
numbers.Subscription.create(subscription, callback);
```

### Get Subscription

```Javascript
numbers.Subscription.get(id, callback);
```

### List Subscriptions

```Javascript
numbers.Subscription.list(query, callback);
```

### Subscription Instance Methods

```Javascript
numbers.Subscription.get(id, function(err, subscription){
  // update subscription
  var updatedData = {orderType:"portins"};
  subscription.update(updatedData, callback)

  // delete subscription
  subscription.delete(callback);
});
```

## TNs
### Get TN

```Javascript
numbers.Tn.get(fullNumber, callback);
```

### List TNs

```Javascript
numbers.Tn.list(query, callback);
```

### TN Instance Methods

```Javascript
numbers.Tn.get(fullNumber, function(err, tn){
  // Get TN Details
  tn.getTnDetails(callback);

  // Get Sites
  tn.getSites(callback);

  // Get Sip Peers
  tn.getSipPeers(callback);

  // Get Rate Center
  tn.getRateCenter(callback)
});
```

## TN Reservation
### Create TN Reservation

```Javascript
numbers.TnReservation.create({"reservedTn":"9195551212"}, callback);
```

### Get TN Reservation

```Javascript
numbers.TnReservation.get(id, callback);
```

### Delete TN Reservation

```Javascript
numbers.TnReservation.get(id, function(err, tn){
  tn.delete(callback);
});
```
## TN Options

### List TN Options

```js
const query = {
  createdDateFrom : "2013-10-22T00:00:00.000Z",
  orderDetails: true,
  tn: 123456789
}
numbers.TnOption.list(client, query, (err, tnOptions) => {
  if (err) {
    console.error(err);
  }
  console.log(tnOptions);
})
```

### Find a specific TN Option Order

```js
const tnOptionOrderId = 'fakeOrderId';
numbers.TnOption.get(tnOptionOrderId, (err, tnOption) => {
  if (err) {
    console.error(err);
  }
  console.log(tnOptions);
})
```

### Add a PortOutPasscode

```js
const tnOptionsOrder = {
  customerOrderId: 'myOrderId',
  tnOptionGroups: [
    {
      portOutPasscode: 'mypass1',
      telephoneNumbers: ['1234567890']
    }
  ]
}
numbers.TnOption.create(tnOptionsOrder, callback) //for callback example see TnOption.get
```

### Create Call Forward Number

```js
const tnOptionsOrder = {
  customerOrderId: 'myOrderId',
  tnOptionGroups: [
    {
      callForward: '2345678901',
      telephoneNumbers: ['1234567890']
    }
  ]
}
numbers.TnOption.create(tnOptionsOrder, callback) //for callback example see TnOption.get
```

### Enable SMS

```js
const tnOptionsOrder = {
  customerOrderId: 'myOrderId',
  tnOptionGroups: [
    {
      sms: 'on',
      telephoneNumbers: ['1234567890']
    }
  ]
}
numbers.TnOption.create(tnOptionsOrder, callback) //for callback example see TnOption.get
```


## Hosted Messaging

### Check importability

```js
const numbers = ["1111", "2222"];

try {
  const importResults = await ImportTnChecker.checkAsync(numbers);
  console.log(importResults);
}
catch (e) {
  console.log(e)
}
```

### Create importTNOrder

```js
const numbers = ["1111", "2222"];

const data = {
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

try {
  const importTnOrder = await ImportTnOrder.createAsync(numbers);
  console.log(importTnOrder);
}
catch (e) {
  console.log(e)
}
```

### Create removeImportedTnOrder

To restore the messaging functionality to the original owner, create a `removeImportedTnOrder` order to remove the numbers from your account.

```js
const numbers = ["1111", "2222"];
const customerOrderId = "customerOrderId"

try {
  const importTnOrder = await RemoveImportedTnOrder.createAsync(customerOrderId, numbers);
  console.log(importTnOrder);
}
catch (e) {
  console.log(e)
}
```

## CSR Lookup

### Create CSR Order

```js
const data = {
  customerOrderId: "MyId5",
  WorkingOrBillingTelephoneNumber:"9198675309",
  accountNumber:"123463",
  endUserPIN:"1231"
};

try {
  const csrOrderResponse = await CsrOrder.createAsync(data);
  console.log(csrOrderResponse.orderId);
  //31e0b16b-4720-4f2e-bb99-1399eeb2ff9e
}
catch (e) {
  console.log(e);
}
```

### Fetch Existing CSR Order

If the CSR order is in an FAILED state, the SDK will throw an error

#### COMPLETE or PROCESSING resposne

```js
const csrOrderId = "1234-abc"

try {
  const csrOrderData = await CsrOrder.getAsync(csrOrderId);
  console.log(csrOrderData.status);
  //COMPLETE
}
catch (e) {
  console.log(e);
}
```

#### FAILED response

```js
const csrOrderId = "1234-abc"

try {
  const csrOrderData = await CsrOrder.getAsync(csrOrderId);
  console.log(csrOrderData.status);
  //Won't fire, as request is failed
}
catch (e) {
  console.log(e);
// [BandwidthError: CSR is not available for this TN] {
//   code: 26500,
//   message: 'CSR is not available for this TN',
//   httpStatus: 200
// }
}
```

## Emergency Notification

### List Recipients

```js
try {
  const response = await EmergencyNotification.listRecipientsAsync(client, {"Size": "20"} );
  console.log(response.emergencyNotificationRecipients.emergencyNotificationRecipient.length);
  //4
}
catch (e) {
  console.log(e);
}
```
### Get Recipient

```js
try {
  const response = await EmergencyNotification.getRecipientAsync(client, "enrid" );
  console.log(response.emergencyNotificationRecipient.identifier);
  //63865500-0904-46b1-9b4f-7bd237a26363
}
catch (e) {
  console.log(e);
}
```
### Replace Recipient

```js
var en = new EmergencyNotification();
en.enrid = 123;

try {
  const response = await en.replaceRecipientAsync(client, recipient);
  console.log(response.emergencyNotificationRecipient.identifier);
  //63865500-0904-46b1-9b4f-7bd237a26363
}
catch (e) {
  console.log(e);
}
```
### Create Recipient

```js
try {
  const response = await EmergencyNotification.createRecipientAsync(client, recipient);
  console.log(response.emergencyNotificationRecipient.identifier);
  //63865500-0904-46b1-9b4f-7bd237a26363
}
catch (e) {
  console.log(e);
}
```
### Delete Recipient

```js
var en = new EmergencyNotification();
en.enrid = 123;

try {
  const response = await en.deleteRecipientAsync(client);
}
catch (e) {
  console.log(e);
}
```
### List Group Orders

```js
try {
  const response = await EmergencyNotification.listGroupOrdersAsync(helper.createClient(), {Size: "20"});
  console.log(response.emergencyNotificationGroupOrders.emergencyNotificationGroupOrder.length);
  //20
}
catch (e) {
  console.log(e);
}
```
### Get Group Order

```js
try {
  const response = await EmergencyNotification.getGroupOrderAsync(helper.createClient(), "orderId");
  console.log(response.emergencyNotificationGroup.orderId);
  //orderId
}
catch (e) {
  console.log(e);
}
```
### Create Group Order

```js
try {
  const response = EmergencyNotification.createGroupOrderAsync(helper.createClient(), groupOrder);
  console.log(response.OrderId);
  //900b3646-18df-4626-b237-3a8de648ebf6
}
catch (e) {
  console.log(e);
}
```
### List Group

```js
try {
  const response = await EmergencyNotification.listGroupsAsync(client, {"Size": "20"} );
  console.log(response.emergencyNotificationGroups.emergencyNotificationGroup.length);
  //20
}
catch (e) {
  console.log(e);
}
```
### Get Group

```js
try {
  const response = await EmergencyNotification.getGroupAsync(client, "engid");
  console.log(response.emergencyNotificationGroup.identifier);
  //63865500-0904-46b1-9b4f-7bd237a26363
}
catch (e) {
  console.log(e);
}
```
### List Endpoint Orders

```js
try {
  const response = await EmergencyNotification.listEnpointOrdersAsync(client, {"Size": "20"} );
  console.log(response.emergencyNotificationEndpointOrders.emergencyNotificationEndpointOrder.length);
  //20
}
catch (e) {
  console.log(e);
}
```
### Get Endpoint Order

```js
try {
  const response = await EmergencyNotification.getEndpointOrderAsync(client, "orderId" );
  console.log(response.emergencyNotificationEndpointOrder.orderId);
  //orderId
}
catch (e) {
  console.log(e);
}
```
### Create Endpoint Orders

```js
try {
  const response = await EmergencyNotification.createEndpointOrderAsync(client, endpoint );
  console.log(response.emergencyNotificationEndpointOrder.orderId);
  //3e9a852e-2d1d-4e2d-84c3-87223a78cb70
}
catch (e) {
  console.log(e);
}
```


## Geocoding
### Make a geocode request

```Javascript
var data = data = {
  addressLine1: "900 Main Campus Dr",
  city: 'raleigh',
  stateCode: 'nc',
  zip: 27606
}

numbers.Geocode.request(data, function(error, address) {
  if (error) {
    return callback(error)
  }
  console.log(address.stateCode, address.houseNumber, address.streetName, address.streetSuffix, address.city)
  //NC, 900, Main Campus, Dr, Raleigh
});
```

## Aeuis

### List Aeuis's

```js
try {
  const response = await Aeuis.listAsync(client, {Size: 20} );
  console.log(response.AlternateEndUserIdentifiers.AlternateEndUserIdentifier.length);
  //20
}
catch (e) {
  console.log(e);
}
```

### Get Aeuis's

```js
try {
  const response = await Aeuis.getAsync(client, "acid" );
  console.log(response.AlternateEndUserIdentifier.Identifier);
  //acid
}
catch (e) {
  console.log(e);
}
```

## Set SipPeer Origination Settings

```js

```
