var Promise = require("bluebird");

var Client = require("./client");
var Site = require("./site");
var SipPeer = require("./sipPeer");
var Subscription = require("./subscription");
var RateCenter = require("./rateCenter");
var Tn = require("./tn");
var TnReservation = require("./tnReservation");
var PortIn = require("./portIn");
var PortOut = require("./portOut");
var ImportToAccount = require("./importToAccount");
var Order = require("./order");
var LnpChecker = require("./lnpChecker");
var Disconnect = require("./disconnect");
var City = require("./city");
var AvailableNumbers = require("./availableNumbers");
var AvailableNpaNxx = require("./availableNpaNxx");
var CoveredRateCenter = require("./coveredRateCenter");
var User = require("./user");
var Account = require("./account");
var InServiceNumber = require("./inServiceNumber");
var DiscNumber = require("./discNumber");
var LsrOrder = require("./lsrOrder");
var Lidbs = require("./lidbs");
var Dlda = require("./dlda");

// Promise.promisifyAll(Client);
// Promise.promisifyAll(Client.prototype);
Promise.promisifyAll(Site);
Promise.promisifyAll(Site.prototype);
// Promise.promisifyAll(SipPeer);
// Promise.promisifyAll(SipPeer.prototype);
// Promise.promisifyAll(Subscription);
// Promise.promisifyAll(Subscription.prototype);
// Promise.promisifyAll(RateCenter);
// Promise.promisifyAll(RateCenter.prototype);
// Promise.promisifyAll(Tn);
// Promise.promisifyAll(Tn.prototype);
// Promise.promisifyAll(TnReservation);
// Promise.promisifyAll(TnReservation.prototype);
// Promise.promisifyAll(PortIn);
// Promise.promisifyAll(PortIn.prototype);
// Promise.promisifyAll(PortOut);
// Promise.promisifyAll(PortOut.prototype);
// Promise.promisifyAll(ImportToAccount);
// Promise.promisifyAll(ImportToAccount.prototype);
// Promise.promisifyAll(Order);
// Promise.promisifyAll(Order.prototype);
// Promise.promisifyAll(LnpChecker);
// Promise.promisifyAll(LnpChecker.prototype);
// Promise.promisifyAll(Disconnect);
// Promise.promisifyAll(Disconnect.prototype);
// Promise.promisifyAll(City);
// Promise.promisifyAll(City.prototype);
// Promise.promisifyAll(AvailableNumbers);
// Promise.promisifyAll(AvailableNumbers.prototype);
// Promise.promisifyAll(AvailableNpaNxx);
// Promise.promisifyAll(AvailableNpaNxx.prototype);
// Promise.promisifyAll(CoveredRateCenter);
// Promise.promisifyAll(CoveredRateCenter.prototype);
// Promise.promisifyAll(User);
// Promise.promisifyAll(User.prototype);
// Promise.promisifyAll(Account);
// Promise.promisifyAll(Account.prototype);
// Promise.promisifyAll(InServiceNumber);
// Promise.promisifyAll(InServiceNumber.prototype);
// Promise.promisifyAll(DiscNumber);
// Promise.promisifyAll(DiscNumber.prototype);
// Promise.promisifyAll(LsrOrder);
// Promise.promisifyAll(LsrOrder.prototype);
// Promise.promisifyAll(Lidbs);
// Promise.promisifyAll(Lidbs.prototype);
// Promise.promisifyAll(Dlda);
// Promise.promisifyAll(Dlda.prototype);

module.exports = {
  Client,
  Site,
  SipPeer,
  Subscription,
  RateCenter,
  Tn,
  TnReservation,
  PortIn,
  PortOut,
  ImportToAccount,
  Order,
  LnpChecker,
  Disconnect,
  City,
  AvailableNumbers,
  AvailableNpaNxx,
  CoveredRateCenter,
  User,
  Account,
  InServiceNumber,
  DiscNumber,
  LsrOrder,
  Lidbs,
  Dlda,
};
